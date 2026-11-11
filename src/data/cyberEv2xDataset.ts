export const datasetLinks = {
  github: "https://github.com/EV2X/Cyber-EV2X",
  schema: "https://github.com/EV2X/Cyber-EV2X/blob/main/dataset/description/README.md",
  downloads: "https://zenodo.org/records/22203144",
  license: "https://creativecommons.org/licenses/by/4.0/",
};

export const datasetDescription =
  "Cyber-EV2X is a co-simulation dataset for studying benign and denial-of-service (DoS) communication in electric vehicle-to-everything (EV2X) networks. Built on the 3D Monaco SUMO Traffic scenario, it combines mobility, energy, wireless communication, and charging information in the EV2EV dataset and the EV2CS dataset.";

interface ScenarioInput {
  config: string;
  name: string;
  traffic: string;
  window: readonly [number, number];
  condition: "Normal" | "Attack";
}

const scenarioInput: ScenarioInput[] = [
  {
    config: "Sparse_A0", name: "5 a.m. Normal", traffic: "Off-peak / sparse",
    window: [18000, 21600], condition: "Normal",
  },
  {
    config: "Sparse_A1", name: "5 a.m. DoS", traffic: "Off-peak / sparse",
    window: [18000, 21600], condition: "Attack",
  },
  {
    config: "Dense_A0", name: "8 a.m. Normal", traffic: "Morning peak / dense",
    window: [28800, 32400], condition: "Normal",
  },
  {
    config: "Dense_A1", name: "8 a.m. DoS", traffic: "Morning peak / dense",
    window: [28800, 32400], condition: "Attack",
  },
];

export const scenarios = scenarioInput;

export const recordTypes = [
  {
    id: 0,
    name: "EV self-state",
    description: "Self-state of the log-owner EV. Type 0 is not a received packet.",
    groups: "Energy, mobility, position",
    fields: ["sender_spd", "sender_hdg", "sender_accel", "sender_battery", "sender_ev_state", "sender_step_energy"],
  },
  {
    id: 1,
    name: "EV2EV reception",
    description: "Message received by a logged EV from an EV or EV attacker.",
    groups: "Mobility, position, signal, energy",
    fields: ["send_ts", "rssi", "link_distance", "packet_size", "transport_protocol", "sender_step_energy"],
  },
  {
    id: 2,
    name: "EV2CS reception",
    description: "Message received by a logged EV from a CS or CS-like attacker.",
    groups: "Position, signal, charging-service",
    fields: ["send_ts", "available_slots", "charging_power", "rssi", "link_distance", "packet_size", "transport_protocol"],
  },
];

export const comparisonRows = [
  { dataset: "VeReMi", communication: "V2V", coverage: "Mobility, Signal", traffic: true, map: "LuST (2D)", mlReady: false, publicAccess: true },
  { dataset: "VeReMi Extension", communication: "V2V", coverage: "Mobility", traffic: true, map: "LuST (2D)", mlReady: false, publicAccess: true },
  { dataset: "BurST-ADMA", communication: "V2V", coverage: "Mobility", traffic: false, map: "Burwood (2D)", mlReady: true, publicAccess: true },
  { dataset: "AhmST", communication: "V2V", coverage: "Mobility", traffic: false, map: "Ahmedabad (2D)", mlReady: true, publicAccess: false },
  { dataset: "VDDD", communication: "V2V + V2I", coverage: "Signal", traffic: false, map: "King Fahad Highway (2D)", mlReady: true, publicAccess: true },
  { dataset: "CICEV2023", communication: "V2I", coverage: "Energy", traffic: true, map: "EV-CS-grid simulator", mlReady: true, publicAccess: true },
  { dataset: "CICEVSE2024", communication: "V2I", coverage: "Energy", traffic: true, map: "Physical EVSE testbed", mlReady: true, publicAccess: true },
  { dataset: "Cyber-EV2X", communication: "V2V + V2I", coverage: "Energy, Mobility, Signal", traffic: true, map: "Monaco (3D)", mlReady: true, publicAccess: true },
];

export const downloads = [
  {
    name: "Core data",
    filename: "data_raw.zip",
    url: "https://zenodo.org/records/22203144/files/data_raw.zip?download=1",
    format: "JSONL",
    description: "Core-feature co-simulation records prepared for release, covering mobility, energy, position, signal, network, and charging data.",
  },
  {
    name: "Enriched data",
    filename: "data_enrich.zip",
    url: "https://zenodo.org/records/22203144/files/data_enrich.zip?download=1",
    format: "JSONL",
    description: "Core records with eight temporal features (T8) added to EV2EV and EV2CS reception records.",
  },
  {
    name: "ML-ready datasets",
    filename: "ml_ready_datasets.zip",
    url: "https://zenodo.org/records/22203144/files/ml_ready_datasets.zip?download=1",
    format: "CSV",
    description: "EV2EV and EV2CS training, validation, and geographically separated test files for each seed.",
  },
];

export const commonFields = ["record_type", "sender_id", "sender_pos", "log_ts", "label"];

export function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}
