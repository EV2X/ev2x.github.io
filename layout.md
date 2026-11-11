# Cyber-EV2X Dataset Website Layout Guide

## 1. Project Goal

Build a modern static documentation website for publishing the Cyber-EV2X dataset.

The website should follow a documentation-style layout similar to VitePress, with:

- A fixed top navigation bar.
- A fixed left sidebar.
- A central content area.
- A right sticky table of contents.
- Smooth navigation between sections.
- Full-text search.
- Light/dark theme switch.
- GitHub repository button.
- Dataset-oriented pages and visualization components.

The website must feel like a professional research dataset portal, not a generic landing page.

---

## 2. Global Page Structure

The global layout must follow this structure:

```text
┌───────────────────────────────────────────────────────────────┐
│ Top Navbar                                                     │
│ Search bar                         Theme switch   GitHub link  │
├────────────────┬───────────────────────────────┬──────────────┤
│ Left Sidebar   │ Main Content                   │ Right Aside  │
│ fixed          │ scrollable page content         │ page outline │
│                │                                │ sticky       │
└────────────────┴───────────────────────────────┴──────────────┘
```

Recommended layout dimensions:

```text
Top navbar height: 64px
Left sidebar width: 260px
Main content max width: 820px to 920px
Right aside width: 220px to 260px
Content horizontal gap: 32px to 48px
```

---

## 3. Top Navbar

The top navbar is fixed at the top of the website.

### 3.1. Position

```text
position: fixed
top: 0
left: 0
right: 0
height: 64px
z-index: 1000
```

### 3.2. Navbar Content

The navbar must contain:

1. Global search box.
2. Light/dark theme switch.
3. GitHub icon button linking to the project repository.

Example structure:

```html
<header class="top-navbar">
  <div class="navbar-search">
    <SearchIcon />
    <input placeholder="Search Cyber-EV2X docs..." />
    <span class="shortcut">⌘ K</span>
  </div>

  <div class="navbar-actions">
    <button class="theme-switch">...</button>
    <a class="github-button" href="https://github.com/..." target="_blank">
      <GithubIcon />
    </a>
  </div>
</header>
```

### 3.3. Search Bar Behavior

The search bar should search across all text content in the website.

Expected behavior:

- Search all pages:
  - Cyber-EV2X (2026)
  - GRETTIA
  - Imprint
- Show matching results in a modal or dropdown.
- Each result should navigate to the relevant page or section.
- Keyboard shortcut can be supported with `Cmd/Ctrl + K`.

Recommended library:

```text
Fuse.js
```

If using VitePress, use built-in local search when possible.

---

## 4. Left Sidebar

The left sidebar is fixed on the left side, below the top navbar.

### 4.1. Position

```text
position: fixed
top: 64px
left: 0
bottom: 0
width: 260px
overflow-y: auto
```

### 4.2. Sidebar Content

The sidebar must contain:

1. Dataset logo/title.
2. Navigation groups.
3. Page links.

Required navigation structure:

```text
Cyber-EV2X

Dataset
  - Cyber-EV2X (2026)

Institution
  - GRETTIA

Legal
  - Imprint
```

Recommended expanded version:

```text
Cyber-EV2X

Dataset
  - Cyber-EV2X (2026)

About
  - GRETTIA
  - Imprint
```

### 4.3. Sidebar Item Behavior

Each sidebar item represents a page.

When the user clicks a sidebar item:

- The central content area must display the selected page.
- The active item must be visually highlighted.
- The right aside must update to show the headings of the current page.
- Page transition should be smooth.

Example structure:

```html
<aside class="left-sidebar">
  <div class="sidebar-logo">
    <img src="/logo.png" />
    <span>Cyber-EV2X</span>
  </div>

  <nav class="sidebar-nav">
    <section class="nav-group">
      <p class="nav-group-title">Dataset</p>
      <a class="nav-item active" href="/cyber-ev2x-2026">
        Cyber-EV2X (2026)
      </a>
    </section>

    <section class="nav-group">
      <p class="nav-group-title">About</p>
      <a class="nav-item" href="/grettia">GRETTIA</a>
      <a class="nav-item" href="/imprint">Imprint</a>
    </section>
  </nav>
</aside>
```

---

## 5. Main Layout Container

The main layout starts after the left sidebar and below the navbar.

### 5.1. Position

```text
margin-left: 260px
padding-top: 64px
```

### 5.2. Internal Layout

Inside the main area, use two columns:

```text
main-page
├── content container
└── right aside
```

Example:

```html
<main class="main-layout">
  <article class="content-container">
    <!-- Current page content -->
  </article>

  <aside class="right-aside">
    <!-- Page table of contents -->
  </aside>
</main>
```

Recommended CSS logic:

```css
.main-layout {
  margin-left: 260px;
  padding-top: 64px;
  display: grid;
  grid-template-columns: minmax(0, 880px) 240px;
  column-gap: 48px;
  justify-content: center;
}
```

---

## 6. Content Container

The content container displays the content of the current page.

### 6.1. Required Pages

The website must include these pages:

```text
1. Cyber-EV2X (2026)
2. GRETTIA
3. Imprint
```

---

## 7. Page: Cyber-EV2X (2026)

This is the main dataset page.

Required sections:

```text
# Cyber-EV2X Dataset (2026)

## Overview

## Key Features

## Dataset Structure

## Simulation Environment

## Attack Scenarios

## Data Schema

## Interactive Map

## Dataset Statistics

## Download

## Citation

## License
```

### 7.1. Overview Section

Purpose:

Explain what the Cyber-EV2X dataset is.

Should include:

- Dataset name.
- Research purpose.
- EV2X communication context.
- Cybersecurity/DoS attack focus.
- Simulation-based dataset construction.

### 7.2. Key Features Section

Use feature cards.

Required cards:

```text
- EV2X Communication
- DoS Attack Scenario
- Charging Station Interaction
- Multi-density Traffic Scenarios
- Message-level Records
- Simulation-based Ground Truth
```

Example component:

```html
<div class="feature-grid">
  <div class="feature-card">
    <h3>EV2X Communication</h3>
    <p>Message-level communication records between electric vehicles and charging stations.</p>
  </div>
</div>
```

### 7.3. Dataset Structure Section

Show dataset folder structure.

Example:

```text
results/
├── Sparse_A0/
├── Sparse_A1/
├── Medium_A0/
├── Medium_A1/
├── Dense_A0/
└── Dense_A1/
```

Explain that each scenario contains JSONL files such as:

```text
EV2X-node[N].json
```

### 7.4. Simulation Environment Section

Describe:

- OMNeT++
- SUMO
- Veins
- EV communication logic
- Charging station interaction
- Mobility simulation
- Traffic density configuration

### 7.5. Attack Scenarios Section

Describe:

- Normal scenario.
- DoS attack scenario.
- Attack window.
- Attacker vehicles.
- Flooding behavior.
- Impact on EV communication.

Use a warning or accent block for attack-related details.

Example:

```html
<div class="danger-callout">
  <strong>DoS attack:</strong>
  Attackers flood EV communication channels during the configured attack window.
</div>
```

### 7.6. Data Schema Section

Describe the main record types:

```text
Type 0: Sent Beacon
Type 1: Received from EV
Type 2: Received from Charging Station
```

Use tables for schema documentation.

Example table:

```text
| Field | Description | Example |
|---|---|---|
| timestamp | Simulation time | 10800.25 |
| sender_id | Sender vehicle ID | EV_12 |
| receiver_id | Receiver vehicle ID | EV_21 |
| message_type | Record type | Type 1 |
```

### 7.7. Interactive Map Section

Add an interactive map component.

Recommended component name:

```text
EV2XMap
```

The map should support placeholders or real data later.

Expected elements:

```text
- EV routes
- Charging station markers
- Attacker markers
- DoS region or attack zone
- Simulation area boundary
```

Recommended libraries:

```text
Leaflet
MapLibre GL
```

### 7.8. Dataset Statistics Section

Add statistic cards and charts.

Recommended components:

```text
DatasetStats
ScenarioChart
MessageTypeChart
AttackDistributionChart
```

Expected statistics:

```text
- Number of scenarios
- Number of EVs
- Number of charging stations
- Number of records
- Message type distribution
- Normal vs attack distribution
```

### 7.9. Download Section

Include dataset download links.

Example:

```text
- GitHub repository
- Zenodo link
- Dataset archive
- Documentation
```

Use placeholder links if final links are not available.

### 7.10. Citation Section

Provide BibTeX block.

Example:

```bibtex
@dataset{cyber_ev2x_2026,
  title = {Cyber-EV2X: A Cybersecurity Dataset for Electric Vehicle Communications},
  author = {Duong, Cong Son and others},
  year = {2026},
  publisher = {Université Gustave Eiffel},
  url = {https://github.com/...}
}
```

### 7.11. License Section

Describe dataset license.

Use placeholder if license is not finalized:

```text
License information will be added before public release.
```

---

## 8. Page: GRETTIA

Required sections:

```text
# GRETTIA

## About GRETTIA

## Research Context

## Cyber-EV2X Project

## Affiliation

## Contributors
```

Content purpose:

- Introduce GRETTIA.
- Explain its relation to intelligent transportation systems.
- Present the project affiliation.
- Mention Université Gustave Eiffel and COSYS/GRETTIA.

Use institution cards when possible.

Example:

```html
<div class="institution-card">
  <h3>Université Gustave Eiffel</h3>
  <p>COSYS / GRETTIA</p>
</div>
```

---

## 9. Page: Imprint

Required sections:

```text
# Imprint

## Dataset Maintainer

## Institution

## Contact

## License

## Disclaimer
```

Content purpose:

- Provide legal and contact information.
- Mention the maintainer.
- Mention the institution.
- Provide repository/contact placeholder.
- Add disclaimer about research dataset usage.

---

## 10. Right Aside Table of Contents

The right aside displays the table of contents for the current page.

### 10.1. Position

```text
position: sticky
top: 96px
height: calc(100vh - 96px)
overflow-y: auto
```

### 10.2. Content

The aside must show all major headings of the current page.

Example:

```text
On this page
- Overview
- Key Features
- Dataset Structure
- Simulation Environment
- Attack Scenarios
- Data Schema
- Interactive Map
- Download
- Citation
- License
```

### 10.3. Behavior

When the user clicks a TOC item:

- Smoothly scroll to the corresponding section.
- Update the active TOC item based on scroll position.
- Highlight active heading.

Implementation recommendation:

```text
Use IntersectionObserver to detect active sections.
```

---

## 11. Responsive Layout

The website must be responsive.

### 11.1. Desktop

For screens larger than 1200px:

```text
Show:
- Top navbar
- Left sidebar
- Main content
- Right aside
```

### 11.2. Tablet

For screens between 768px and 1199px:

```text
Show:
- Top navbar
- Left sidebar can become collapsible
- Main content
- Hide right aside or move TOC above content
```

### 11.3. Mobile

For screens smaller than 768px:

```text
Show:
- Top navbar
- Mobile menu button
- Hidden/collapsible sidebar
- Main content full width
- Hide right aside
```

Mobile layout:

```text
┌────────────────────────────────────┐
│ Top Navbar                         │
├────────────────────────────────────┤
│ Mobile Sidebar Drawer              │
├────────────────────────────────────┤
│ Main Content                       │
└────────────────────────────────────┘
```

---

## 12. Recommended Project Structure

If using VitePress:

```text
cyber-ev2x-docs/
├── docs/
│   ├── index.md
│   ├── cyber-ev2x-2026.md
│   ├── grettia.md
│   ├── imprint.md
│   ├── public/
│   │   ├── logo.png
│   │   ├── dataset-preview.png
│   │   └── map-preview.png
│   └── .vitepress/
│       ├── config.ts
│       ├── theme/
│       │   ├── index.ts
│       │   └── custom.css
│       └── components/
│           ├── DatasetStats.vue
│           ├── EV2XMap.vue
│           ├── ScenarioChart.vue
│           ├── MessageTypeChart.vue
│           └── AttackDistributionChart.vue
```

If using React + Vite:

```text
cyber-ev2x-site/
├── public/
│   ├── logo.png
│   └── dataset-preview.png
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── pages/
│   │   ├── CyberEV2X2026.tsx
│   │   ├── Grettia.tsx
│   │   └── Imprint.tsx
│   ├── components/
│   │   ├── TopNavbar.tsx
│   │   ├── LeftSidebar.tsx
│   │   ├── RightAside.tsx
│   │   ├── DatasetStats.tsx
│   │   ├── EV2XMap.tsx
│   │   └── charts/
│   ├── styles/
│   │   └── global.css
│   └── data/
│       └── search-index.ts
└── package.json
```

---

## 13. Implementation Notes

The AI agent must preserve the layout logic:

- Top navbar is always visible.
- Left sidebar is fixed on desktop.
- Main content changes based on selected page.
- Right aside changes based on current page headings.
- Smooth scroll must work for section navigation.
- Dark/light theme must affect all components consistently.
- The design must remain clean, academic, and suitable for a research dataset.
