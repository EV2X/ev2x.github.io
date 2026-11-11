# PROJECT CONTEXT — EV2X VANET SIMULATION

> **File purpose:** Provides the AI Agent with a complete picture of the project — architecture, system design, directory structure, and data flow. Read this file **first** before making any code changes.

---

## 1. Project Overview

### 1.1. What is this project?

This is a **network attack simulation (DoS Flooding)** system for **V2V (Vehicle-to-Vehicle)** and **V2I (Vehicle-to-Infrastructure)** communications between **electric vehicles (EV)**, **Charging Stations (CS)**, and **RSUs (Roadside Units)**.

Context: In a VANET (Vehicular Ad-hoc Network), electric vehicles use **802.11p (DSRC)** on the **5.9 GHz** band to exchange charging information. An attacker performs a dual DoS attack: (1) **V2I flood** — floods `CHARGE_REQUEST` spoofed packets to saturate the CS queue, and (2) **V2V flood** — floods fake CAM/beacon packets to jam the V2X channel between vehicles. The **cyber-physical consequence**: EVs receive no charging response, must search for another station, consume extra battery, and may run out of power mid-route.

### 1.2. Tech Stack

| Component | Version | Role |
|---|---|---|
| **OMNeT++** | 5.6.2 | Discrete-event network simulator (simulation core) |
| **INET Framework** | 4.2.5 | Network protocol models (IPv4, UDP, IEEE 802.11) |
| **Veins** | 5.2 | SUMO ↔ OMNeT++ bridge via TraCI protocol |
| **SUMO** | 1.12.0 | Road traffic simulator (position, speed, EV battery) |
| **Python** | 3.x | Results analysis, academic chart generation |
| **OS** | Windows 10 | Development environment |

---

## 2. Simulation Architecture

### 2.1. Layer Interaction Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   OMNeT++ 5.6.2                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              INET 4.2.5                           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │   │
│  │  │ 802.11p  │  │   UDP    │  │    IPv4       │   │   │
│  │  │  Radio   │  │  Socket  │  │  AutoConfig   │   │   │
│  │  └──────────┘  └──────────┘  └──────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────┐   ┌────────────────────────┐   │
│  │    Veins 5.2        │   │   Application Layer    │   │
│  │  ┌──────────────┐   │   │  ┌──────────────────┐  │   │
│  │  │ TraCI Client │◄──┼───┼──┤ EV App (node[])  │  │   │
│  │  │ (Manager)    │   │   │  ├──────────────────┤  │   │
│  │  └──────┬───────┘   │   │  │ CS App (cs[])    │  │   │
│  └─────────┼───────────┘   │  ├──────────────────┤  │   │
│            │ TCP/IP        │  │ DoS (attacker[]) │  │   │
│            │ port 9999     │  └──────────────────┘  │   │
│            ▼               └────────────────────────┘   │
│  ┌─────────────────┐                                    │
│  │  SUMO 1.12.0    │  ← Runs in parallel, synchronised  │
│  │  Traffic Sim     │    via TraCI every 1.0 second        │
│  └─────────────────┘                                    │
└─────────────────────────────────────────────────────────┘
```

### 2.2. SUMO ↔ OMNeT++ Synchronisation Mechanism

- **SUMO** runs with `step-length = 1.0s`. Each step, SUMO updates position, speed, acceleration, and battery for all vehicles.
- **VeinsInetManager** (in OMNeT++) calls TraCI every `updateInterval = 1.0s` to sync vehicle state.
- **Important:** `step-length` (SUMO) **MUST** equal `updateInterval` (OMNeT++) **MUST** equal `socCheckInterval` (App). Currently all three = **1.0s**.

### 2.3. V2X Communication Flow

V2X communication uses **UDP** on multicast address `239.0.0.1:9001` for broadcast, and **unicast** for established EV↔CS communication:

```
EV(ev[i]) ——multicast——► 802.11p ——► All nodes in radio range
                                        ├── ev[j]       (other EVs)
                                        ├── cs[k]       (charging station)
                                        ├── ev_attack[m] (DoS attacker)
                                        └── cs_attack[n] (rogue charging station)

CS(cs[k]) ——unicast——► EV(ev[i])   (CHARGE_RESPONSE, targeted)
EV(ev[i]) ——unicast——► CS(cs[k])   (CHARGE_COMPLETE, targeted)
```

**Multicast messages:** MSG_EV_BEACON, MSG_CHARGE_REQUEST, MSG_STATION_UPDATE
**Unicast messages:** MSG_CHARGE_RESPONSE (CS→EV), MSG_CHARGE_COMPLETE (EV→CS)

---

## 3. Main Application Modules

### 3.1. VeinsInetSampleApplication (EV — `node[]`)

- **File:** `src/veins_inet/VeinsInetSampleApplication.{h,cc,ned}`
- **Role:** Main EV logic — battery monitoring, CS discovery via V2X, charging navigation, JSON dataset logging (VeReMi-style).
- **State Machine:****

```
DRIVING (0) ──[SoC < 0.2]──► LOW_BATTERY (1) ──[CS response]──► ROUTING_TO_CS (2)
     ▲                              │                                    │
     │                   [No response after 30s]               [Arrived at CS]
     │                   → blacklist nearby CSs                        ▼
     │                   → findBestStation(farther)     ─────► ROUTING_TO_CS
     │                                                              │
CHARGED (5) ◄──[SoC ≥ 0.8]── CHARGING (4) ◄──[Stopped]── PARKING (3)
     │
     └── Resume original route → DRIVING (clear overloadedStations)

Special: SoC < 0.01 → DEAD (6)  ;  Routing timeout (120s) → back to LOW_BATTERY
```

- **V2X Message Types:**

| Enum | Value | Description |
|---|---|---|
| `MSG_EV_BEACON` | 10 | Periodic beacon (CAM) |
| `MSG_CHARGE_REQUEST` | 20 | EV charge request |
| `MSG_CHARGE_RESPONSE` | 30 | CS response (EV does not relay) |
| `MSG_STATION_UPDATE` | 40 | CS broadcasts available slot info |
| `MSG_CHARGE_COMPLETE` | 50 | EV notifies CS charging complete, releases slot |

- **OMNeT++ Signals (40 signals):**
  - **Battery/Energy:** `socSignal`, `batteryWhSignal`, `electricityConsumptionSignal`
  - **Kinematics:** `evSpeedSignal`, `evAccelerationSignal`, `evHeadingSignal`, `evPosX/YSignal`
  - **Communication:** `msgSentSignal`, `msgReceivedSignal`, `chargeRequestLatencySignal`, `pdrRunningSignal`
  - **DoS impact:** `retransmissionCountSignal`, `rerouteCountSignal`, `energyLostInSearchSignal`, `csOverloadRerouteSignal`
  - **Routing:** `distToTargetCSSignal`, `etaToCSSignal`, `csOccupancyRateSignal`
  - **NIC Energy:** `commTxEnergySignal`, `commRxEnergySignal`, `commIdleEnergySignal`, `totalCommEnergyWhSignal`, `crossLayerEnergyWhSignal`
  - **Labels:** `attackLabelSignal` (0 = normal, 1 = under attack)

- **Dataset JSON (VeReMi-style):** Each EV writes 1 file `EV2X-ev[N].json` in JSON Lines format, 3 event types (type 0–2). Details: see `descriptions/features.md`.

> **Note:** All EVs write JSON (no more 10% sampling). MSG_CHARGE_COMPLETE uses unicast (EV→CS) once the CS address is known.

> **ML-optimized schema (v2):** The dataset has been upgraded to optimise for Machine Learning. Key changes: (1) **Receiver anonymisation** — `receiver` and `receiver_pos` removed from Type 1 and Type 2 to prevent overfitting on node IDs; (2) **Cross-layer distance** — `distance` (3D Euclidean distance) added to Type 1 and Type 2; (3) **Network-layer metrics** — `packet_size` (bytes), `msg_type` (OMNeT++ packet name), `transport_proto` (`"UDP"` for V2V, `"TCP"` for V2I) added to Type 1 and Type 2 for DoS and Protocol Anomaly detection; (4) **Temporal delta** — `delta_time` added to Type 0 for beacon frequency analysis and V2V flood detection (inter-arrival time feature).

### 3.2. ChargingStationApp (CS — `cs[]`)

- **File:** `src/veins_inet/ChargingStationApp.{h,cc,ned}`
- **Role:** Manages charging slots, responds to EVs via V2X, **protects queue against DoS**.
- **Anti-DoS mechanism (Silent Drop):**
  - Token bucket: at most `maxMsgQueuePerInterval` (default 10, toymap-dos=2) requests/second.
  - Exceeds threshold → `isOverloaded = true` → **silent DROP** (no response sent).
  - Emits `stationDroppedMsgSignal` for statistics.
  - Auto-recovers when traffic drops below threshold (resumes normal responses).
  - **Important:** CS does not send reject/overloaded responses → EV does not know CS is flooded → must wait for timeout.

### 3.3. DoSAttackerApp (Attacker — `ev_attack[]`)

- **File:** `src/veins_inet/DoSAttackerApp.{h,cc,ned}`
- **Role:** Executes a dual DoS attack (V2I + V2V) to cause full V2X network disruption.
- **Mechanism:** Uses `cMessage` self-messages (not `TimerManager`) to avoid `fmod` errors.
- **V2I Flood (MSG_CHARGE_REQUEST = 20):** Spoofed packets with SoC=0.01, batteryWh=600, neededWh=54000 (faking urgent charge need) → saturates CS queue.
- **V2V Flood (MSG_EV_BEACON = 10):** Fake CAM/beacon packets with real kinematics from TraCI (speed, heading) but spoofed SoC = 0.85 → corrupts EV neighbour tables. Enabled/disabled via NED parameter `v2vFlood` (default = true).
- **Time-windowed Attack:**
  - `attackStartTime` (NED, default 0s): flooding start time (0 = immediately when attacker spawns).
  - `attackStopTime`  (NED, default 0s): flooding stop time (0 = attack runs until end of sim).
  - If `attackStartTime > 0`, timer is scheduled at `attackStartTimeS` instead of immediately.
  - After `attackStopTime`, `active = false` and timer is cancelled → attacker silent for the rest of the sim.
  - **Toymap-dos:** attack window `[300s, 700s]` configured in `omnetpp.ini` to create pre-attack / during / post-attack baseline.
- **No JSON logging:** `ev_attack` does not create its own JSON file. Attacker activity is observed indirectly through the EV dataset (type:1 packets from attacker in EV JSON, and DoS impact on CS responses).

### 3.4. CSAttackerApp (Rogue CS — `cs_attack[]`)

- **File:** `src/veins_inet/CSAttackerApp.{h,cc,ned}`, `VeinsInetCSAttacker.ned`
- **Role:** Impersonates a legitimate charging station to lure EVs to a rogue station (independent of the V2I/V2V DoS by `ev_attack`).
- **Spoofing mechanism:**
  - Broadcasts fake `MSG_CHARGE_RESPONSE` (msgType=30) with `availableSlots=4`, `chargingPower=50000W` (extremely attractive to low-SoC EVs).
  - Broadcasts fake `MSG_STATION_UPDATE` (msgType=31) advertising the station as always having free slots.
  - `beaconFlood=true` sends periodically every `floodInterval=1s` (same rate as `ev_attack` flood).
- **Static position:** `VeinsInetCSAttacker extends AdhocHost` + `StationaryMobility`. Coordinates (x,y) configured via `*.cs_attack[N].mobility.initialX/Y/Z` in `omnetpp.ini`.
- **Attack window:** `attackStartTime` / `attackStopTime` synchronised with `ev_attack` in the same A1 config.
- **No JSON logging:** `cs_attack` does not create its own dataset. Spoofed responses appear as type:2 in the EV dataset (identifiable by `stationId` starting with `evCSA_`).
- **Security A0:** `*.numCSAttack = 0` in `[General]` ensures no `cs_attack` nodes in A0 scenarios.

---

## 4. Energy Models

### 4.1. Physical Energy (Physical — SUMO EV Device)

Formula per step dt=1s:

$$F_{net} = \underbrace{m \cdot g \cdot c_r}_{F_{roll}} + \underbrace{\frac{1}{2} \rho C_d A v^2}_{F_{aero}} + \underbrace{m(1+i_{rot}) \cdot a}_{F_{accel}}$$

$$P_{mech} = F_{net} \cdot v$$

- If $P_{mech} \geq 0$: $P_{elec} = P_{mech} / \eta_p + P_{const}$ (motoring)
- If $P_{mech} < 0$: $P_{elec} = P_{mech} \cdot \eta_r + P_{const}$ (regen braking)

$$E_{step} = P_{elec} \cdot dt / 3600 \quad [Wh]$$

**Vehicle parameters (Nissan Leaf):**

| Parameter | Value | Unit |
|---|---|---|
| Mass $m$ | 1580 | kg |
| Frontal area $A$ | 2.3 | m² |
| Drag coefficient $C_d$ | 0.28 | — |
| Rolling resistance $c_r$ | 0.01 | — |
| Motoring efficiency $\eta_p$ | 0.90 | — |
| Regen efficiency $\eta_r$ | 0.60 | — |
| Auxiliary load $P_{const}$ | 100 | W |
| Max battery capacity | 60000 | Wh |
| Initial battery (toymap) | 700–1500 | Wh |

### 4.2. NIC Communication Energy (Communication — 802.11p)

State-based energy model:

| State | Power | Activated |
|---|---|---|
| **TX** (Transmit) | $P_{TX}$ = 1.5 W | When sending a V2X packet (`sendPacket`) |
| **RX** (Receive) | $P_{RX}$ = 1.0 W | When receiving a V2X packet (`processPacket`) |
| **IDLE** (Idle) | $P_{IDLE}$ = 0.8 W | Remaining time in the cycle |

**Formula per packet:**
$$T_{airtime} = \frac{packetBytes \times 8}{6 \times 10^6} \quad [s]$$
$$E_{tx} = P_{TX} \times T_{airtime}, \quad E_{rx} = P_{RX} \times T_{airtime}$$
$$E_{idle} = P_{IDLE} \times \max(0, \Delta t_{cycle} - T_{txrx\_total})$$

**Cross-layer aggregate:**
$$E_{crosslayer} = E_{physical} + E_{comm} \quad [Wh]$$

---

## 5. Directory Structure

```
demo/ev2x/
├── guidelines/                      ← 📋 AI Agent guidance documents (you are reading this)
│   ├── context.md                   ← Project context (this file)
│   ├── skill.md                     ← Required technical skills
│   └── rule.md                      ← Mandatory rules
│
├── src/veins_inet/                  ← 🔧 C++ / NED / MSG SOURCE CODE
│   ├── VeinsInetSampleApplication.{h,cc,ned}  ← Main EV logic (~1100 lines .cc)
│   ├── ChargingStationApp.{h,cc,ned}          ← Charging station logic
│   ├── DoSAttackerApp.{h,cc,ned}              ← DoS attack logic
│   ├── VeinsInetApplicationBase.{h,cc,ned}    ← Base class (V2X socket, TraCI)
│   ├── VeinsInetCar.ned                       ← EV compound module
   ├── VeinsInetAttackerCar.ned               ← ev_attack compound module
   ├── VeinsInetChargingStation.ned           ← Charging station compound module
   ├── VeinsInetCSAttacker.ned               ← Rogue CS compound module (cs_attack)
   ├── CSAttackerApp.{h,cc,ned}              ← Rogue CS logic (A1 only)
│   ├── VeinsInetManager.{h,cc,ned}            ← TraCI ↔ SUMO manager
│   ├── VeinsInetMobility.{h,cc,ned}           ← TraCI position synchronisation
│   ├── VeinsInetSampleMessage.msg              ← V2X message definitions
│   ├── VeinsInetSampleMessage_m.{h,cc}        ← Auto-generated from .msg
│   └── package.ned                             ← package ev2x.veins_inet;
│
├── simulations/veins_inet/          ← ⚙️ SIMULATION CONFIGURATION
│   ├── omnetpp.ini                  ← Master config (General, toymap, toymap-dos, ...)
│   ├── Scenario.ned                 ← Network topology (ev[], ev_attack[], cs[], cs_attack[])
│   ├── package.ned                  ← package ev2x.simulations.veins_inet;
│   ├── toymap.launchd.xml           ← SUMO launcher for toymap baseline
│   ├── toymap-dos.launchd.xml       ← SUMO launcher for toymap DoS
│   ├── monaco.launchd.xml           ← SUMO launcher for Monaco
│   ├── toymap-obstacles.xml         ← Physical obstacles (toymap)
│   ├── obstacles.xml                ← Physical obstacles (Monaco)
│   │
│   ├── scenario/                    ← 🗺️ MAPS AND ROUTES
│   │   ├── toymap/                  ← 3×3 grid map (quick testing)
│   │   │   ├── toymap.net.xml           ← Road network (9 nodes, ~24 edges)
│   │   │   ├── toymap.rou.xml           ← 12 regular vehicles + 10 EVs (battery 700–1500 Wh)
│   │   │   ├── toymap_attacker.rou.xml  ← 3 attacker vehicles (depart t=50,150,500)
│   │   │   ├── toymap.sumocfg           ← SUMO baseline (1200s, step=1.0s)
│   │   │   ├── toymap-dos.sumocfg       ← SUMO DoS (adds attacker routes)
│   │   │   ├── toymap.add.xml           ← 3 charging stations (150/250/350 kW)
│   │   │   └── generate_toymap.py       ← Map generation script
│   │   │
│   │   ├── monaco/                  ← Real Monaco road network
│   │   │   ├── in/most.net.xml          ← Monaco road network (~100+ edges)
│   │   │   ├── in/route/most.ev.rou.xml ← EV routes
│   │   │   ├── in/route/most.attacker.rou.xml ← Attacker routes
│   │   │   ├── in/add/charging_stations.add.xml ← 20 charging stations (7.4–150 kW)
│   │   │   ├── generate_ev_routes.py
│   │   │   └── generate_charging_stations.py
│   │   │
│   │   ├── luxembourg/              ← Luxembourg LUST dataset
│   │   ├── gothamcity/              ← Gotham City test
│   │   └── thuyloi/                 ← AODV routing test
│   │
│   └── results/                     ← 📊 RESULTS AND ANALYSIS
│       ├── ev2x_dataset/            ← Per-EV CSV (ev2x_dataset_node[N].csv)
│       ├── analysis/                ← Summary reports + figures
│       ├── feature_analysis/        ← Feature statistics + figures
│       ├── *.sca / *.vec / *.vci    ← OMNeT++ raw output
│       │
│       ├── analyze_dos.py           ← DoS impact analysis (6 figures)
│       ├── analyze_results.py       ← General results parser (.sca/.vec)
│       ├── data_analysis.py         ← Correlation + violin plots
│       ├── compare_energy.py        ← Verify SUMO energy formula
│       ├── feature_analysis.py      ← Per-feature statistics (11 figures)
      ├── plot_energy_analysis.py        ← Normal vs DoS comparison (4-panel)
       ├── plot_energy_timeseries.py      ← Energy time series
       ├── plot_dos_window_analysis.py    ← 5-panel: pkts/s, comm, phys, SoC, speed (Y=simtime) + attacker overlay
       └── verify_energy.py              ← EV energy formula verification
│
├── Makefile                         ← Build rules (DO NOT run without permission!)
└── .nedexclusions                   ← NED scan exclusions
```

---

## 6. Simulation Scenarios

### 6.1. Toymap Baseline (`[Config toymap]`)

- **Map:** 3×3 grid, 9 intersections, ~24 edges
- **Vehicles:** 12 regular vehicles (ignored by OMNeT++) + 10 EVs (battery 700–1500 Wh)
- **Charging stations:** 3 CS (150/250/350 kW, 6 slots each)
- **Duration:** 1200s (20 min), step=1.0s
- **No attacker**

### 6.2. Toymap DoS (`[Config toymap-dos]`)

- **Extends toymap** + adds 3 attacker vehicles (depart t=50, 150, 500)
- **Flood rate:** `floodInterval = 40s` (1 pkt/s/attacker)
- **CS protection:** `maxMsgQueuePerInterval = 2, broadcastInterval = 1s` → CS silently drops when overloaded
- **Attack window:** `attackStartTime = 300s, attackStopTime = 700s` (attacker floods during [300s, 700s])
- **EV attack_label:** dynamic per `attackWindowStart = 300s, attackWindowEnd = 700s` (CSV column = 1 within window)
- **EV timeout:** `chargeResponseTimeout = 30s` → fallback route when no CS responds

### 6.3. Monaco Baseline (`[General]` default)

- **Map:** Real Monaco road network (~7 km × 5.5 km, OSM)
- **Vehicles:** Mixed urban traffic (bus, tram, pedestrians) + 19 EVs
- **Charging stations:** 38 CS (7.4 kW → 150 kW, 4 power tiers)
- **SUMO duration:** begin=14400s, end=50400s → OMNeT++ 0–36000s (10 hours)
- **No attacker** — `most.sumocfg` does not load `most.attacker.rou.xml`
- **Launcher:** `monaco.launchd.xml` → `most.sumocfg`

### 6.4. Monaco DoS (`[Config monaco-dos]`)

- **Extends Monaco Baseline** + 3 attacker vehicle flows
- **Launcher:** `monaco-dos.launchd.xml` → `most-dos.sumocfg` (adds `most.attacker.rou.xml` to route-files)
- **Attack window (OMNeT++):** `attackStartTime = 10800s, attackStopTime = 25200s`
  - Pre-attack: 0–10800s (3h) — EVs establish normal operation
  - Attack: 10800–25200s (4h = 14400s) — 3 flows flood continuously
  - Post-attack: 25200–36000s (3h) — channel recovers
- **Attacker flows** (`most.attacker.rou.xml`, each flow SUMO 25200–39600, period=600s):
  - `atk_flow_0`: 152943#1 → -153053 (centre → west, covers CS0, CS7, CS14, CS6)
  - `atk_flow_1`: -152701#2 → 153391#0 (north → centre-south, covers CS1, CS2, CS3)
  - `atk_flow_2`: 153383#4 → -153339#1 (southeast → north, covers CS8, CS9, CS5)
  - 24 vehicles/flow × 3 = 72 vehicles total; 3–6 vehicles active at any given time
- **Flood rate:** `floodInterval = 40s` → 3–6 pkt/s total, sufficient to saturate CS queue
- **CS protection:** `maxMsgQueuePerInterval = 2, broadcastInterval = 1s` → CS overloads immediately at ≥3 flood pkt/s (isOverloaded=true → silent drop)
- **EV attack_label:** CSV column = 1 within `[attackWindowStart=10800s, attackWindowEnd=25200s]`
- **EV timeout:** chargeResponseTimeout=30s → blacklist nearby CSs → reroute to farther CS → energy waste

### 6.5. 6 Density × Attack Scenarios (Dataset Generation)

| Config | Density | Attack | SUMO Window | OMNeT++ | scenarioFolder |
|--------|---------|--------|-------------|---------|----------------|
| `Sparse_A0` | Sparse  | None | 18000–21600 | 3600s | `Sparse_A0` |
| `Sparse_A1` | Sparse  | DoS  | 18000–21600 | 3600s | `Sparse_A1` |
| `Medium_A0` | Medium  | None | 21600–25200 | 3600s | `Medium_A0` |
| `Medium_A1` | Medium  | DoS  | 21600–25200 | 3600s | `Medium_A1` |
| `Dense_A0`  | Dense   | None | 28800–32400 | 3600s | `Dense_A0`  |
| `Dense_A1`  | Dense   | DoS  | 28800–32400 | 3600s | `Dense_A1`  |

- **A0 (baseline):** No attacker, `attackWindowEnd = 0`.
- **A1 (DoS):** 3 attacker flows (same routes as `most.attacker.rou.xml`), `maxMsgQueuePerInterval = 2`, attacker active for the full 1h. Dual DoS: V2I (MSG_CHARGE_REQUEST) + V2V (fake MSG_EV_BEACON).
- **Output:** `results/{scenarioFolder}/EV2X-ev[N].json` (only EVs write JSON; ev_attack and cs_attack do not write separate files).
- **config.json:** `results/{scenarioFolder}/config.json` — scenario metadata, written once by `ev[0]` at simulation end. Contains: `scenario`, `attack_type`, `attack_window_start/end`, `num_ev/ev_attack/cs/cs_attack`, `sim_time_s`.
- **Attacker routes per scenario:** `most.attacker-{sparse|medium|dense}.rou.xml` — begin/end match the SUMO window.

### 6.6. ToyMap Dataset Generation Configs

| Config | Map | Attack | SUMO Window | OMNeT++ | scenarioFolder |
|--------|-----|--------|-------------|---------|----------------|
| `ToyMap_A0` | 3×3 grid | None | 0–1200 | 1200s | `ToyMap_A0` |
| `ToyMap_A1` | 3×3 grid | DoS  | 0–1200 | 1200s | `ToyMap_A1` |

- **ToyMap_A0** (`extends = toymap`): Inherits all CS config (3 stations 150/250/350 kW), adds `scenarioFolder = "ToyMap_A0"`, `attackWindowStart = 0s`, `attackWindowEnd = 0s`.
- **ToyMap_A1** (`extends = toymap-dos`): Inherits all DoS config from `toymap-dos` (3 attacker vehicles, window 300–700s, `maxMsgQueuePerInterval = 2`), adds `scenarioFolder = "ToyMap_A1"`.
- **JSON schema:** Identical to Monaco — same event types 0/1/2, same field names.
- **Differences from Monaco:** Initial battery 700–1500 Wh (very low to force fast charging), 10 EVs, 3 CS, 1200s.

---

## 7. Output Data Flow

### 7.1. OMNeT++ Native

| File | Contents |
|---|---|
| `*.sca` | Scalar statistics (sum, mean, min, max) |
| `*.vec` | Vector time-series (values over time) |
| `*.vci` | Vector index for fast access |

### 7.2. JSON Dataset (Per-Vehicle, VeReMi-style)

**Path:** `results/{scenarioFolder}/EV2X-{nodeId}.json`

**Format:** JSON Lines — each line is a JSON object (event). There are 3 event types based on the `type` field:

| type | Meaning | File |
|------|---------|------|
| 0 | EV sends beacon | EV2X-ev[N].json |
| 1 | EV receives message from EV (or ev_attack) | EV2X-ev[N].json |
| 2 | EV receives message from CS (or cs_attack) | EV2X-ev[N].json |

> **Note:** `ev_attack` and `cs_attack` do not write separate JSON files. V2V flood packets from `ev_attack` appear as type:1 in the EV dataset; spoofed responses from `cs_attack` appear as type:2 (identifiable by `stationId` starting with `evCSA_`).

**Common fields:** `type`, `sender`, `sender_pos`, `sender_spd`, `ts`

**Additional fields for EV (type 0):** `sender_hdg`, `soc`, `battery_wh`, `ev_state`, `accel`, `physical_energy_wh`, `comm_energy_wh`

**Additional fields for received (type 1-2):**
- `receiver`, `receiver_pos` (3D `[x,y,z]`), `rssi`, `send_ts`
- Type 1 adds: `soc`, `battery_wh`, `ev_state`, `accel`, `physical_energy_wh`, `comm_energy_wh` (from sender payload), `distance_to_sender` (3D Euclidean distance)
- Type 2 adds: `stationId`, `availableSlots`, `totalSlots`, `chargingPower`, `csOverloaded`

> Full field details: see `descriptions/features.md`

---

## 8. Key Terminology

| Term | Explanation |
|---|---|
| **SoC** | State of Charge — battery level [0..1] |
| **PDR** | Packet Delivery Ratio — ratio of successfully received packets |
| **CBR** | Channel Busy Ratio — radio channel utilisation |
| **RSSI** | Received Signal Strength Indicator — signal strength |
| **TraCI** | Traffic Control Interface — SUMO control protocol |
| **DSRC** | Dedicated Short-Range Communication — 802.11p |
| **CAM** | Cooperative Awareness Message — periodic beacon |
| **Cross-layer** | Cross-layer effect (network → physical) |
| **Amplification** | Amplification effect — 1 flood packet triggers N response packets |
