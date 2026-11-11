import { datasetDescription } from "./cyberEv2xDataset";

export type PageId = "cyber-ev2x-2026" | "grettia" | "imprint";
export type ThemeMode = "light" | "dark";

export interface TocHeading {
  id: string;
  title: string;
}

export interface PageMeta {
  id: PageId;
  title: string;
  description: string;
  headings: TocHeading[];
}

export interface NavItem {
  id: PageId;
  label: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface SearchEntry {
  pageId: PageId;
  pageTitle: string;
  headingId?: string;
  headingTitle?: string;
  excerpt: string;
  keywords: string;
}

export const pages: Record<PageId, PageMeta> = {
  "cyber-ev2x-2026": {
    id: "cyber-ev2x-2026",
    title: "Cyber-EV2X (2026)",
    description: datasetDescription,
    headings: [
      { id: "overview", title: "Overview" },
      { id: "simulation", title: "Simulation" },
      { id: "runs", title: "Simulation seeds" },
      { id: "schema", title: "Schema" },
      { id: "processing", title: "Data preparation" },
      { id: "partitioning", title: "Geographic split" },
      { id: "downloads", title: "Downloads" },
      { id: "citation-license", title: "Citation / License" },
    ],
  },
  grettia: {
    id: "grettia",
    title: "GRETTIA",
    description: "Research context and institutional affiliation for Cyber-EV2X.",
    headings: [
      { id: "about-grettia", title: "About GRETTIA" },
      { id: "research-context", title: "Research Context" },
      { id: "cyber-ev2x-project", title: "Cyber-EV2X Project" },
      { id: "affiliation", title: "Affiliation" },
      { id: "contributors", title: "Contributors" },
    ],
  },
  imprint: {
    id: "imprint",
    title: "Imprint",
    description: "Institution, contact, license, and disclaimer information.",
    headings: [
      { id: "institution", title: "Institution" },
      { id: "contact", title: "Contact" },
      { id: "license", title: "License" },
      { id: "disclaimer", title: "Disclaimer" },
    ],
  },
};

export const navGroups: NavGroup[] = [
  {
    title: "Dataset",
    items: [{ id: "cyber-ev2x-2026", label: "Cyber-EV2X (2026)" }],
  },
  {
    title: "About",
    items: [
      { id: "imprint", label: "Imprint" },
      { id: "grettia", label: "GRETTIA" },
    ],
  },
];

export const searchIndex: SearchEntry[] = [
  {
    pageId: "cyber-ev2x-2026",
    pageTitle: pages["cyber-ev2x-2026"].title,
    headingId: "overview",
    headingTitle: "Overview",
    excerpt: datasetDescription,
    keywords: "dataset comparison scenarios 5am 8am sparse dense Monaco 3D SUMO OMNeT Veins INET coordinated DoS",
  },
  {
    pageId: "cyber-ev2x-2026",
    pageTitle: pages["cyber-ev2x-2026"].title,
    headingId: "runs",
    headingTitle: "Simulation seeds",
    excerpt: "Five simulation seeds pair Normal and DoS runs for both traffic periods.",
    keywords: "seed reproducibility runs r01 r02 r03 r04 r05",
  },
  {
    pageId: "cyber-ev2x-2026",
    pageTitle: pages["cyber-ev2x-2026"].title,
    headingId: "partitioning",
    headingTitle: "Geographic split",
    excerpt: "Training/validation and test records use geographically separated sender-position regions.",
    keywords: "geographic partition sender region temporal embargo balancing",
  },
  {
    pageId: "cyber-ev2x-2026",
    pageTitle: pages["cyber-ev2x-2026"].title,
    headingId: "schema",
    headingTitle: "Schema",
    excerpt: "Core-feature JSON Lines records and ML-ready CSV files with EV2EV and EV2CS observations.",
    keywords: "schema json csv record_type sender_id sender_pos log_ts send_ts label battery rssi",
  },
  {
    pageId: "cyber-ev2x-2026",
    pageTitle: pages["cyber-ev2x-2026"].title,
    headingId: "downloads",
    headingTitle: "Downloads",
    excerpt: "Download Core, enriched, and ML-ready dataset packages from Zenodo.",
    keywords: "download zenodo archive data_raw data_enrich ml_ready_datasets",
  },
  {
    pageId: "cyber-ev2x-2026",
    pageTitle: pages["cyber-ev2x-2026"].title,
    headingId: "citation-license",
    headingTitle: "Citation / License",
    excerpt: "Zenodo dataset citation and the CC BY 4.0 license.",
    keywords: "citation zenodo license CC BY 4.0 copyright",
  },
  {
    pageId: "grettia",
    pageTitle: pages.grettia.title,
    excerpt: "COSYS/GRETTIA at Université Gustave Eiffel provides the research context for Cyber-EV2X.",
    keywords: "grettia universite gustave eiffel cosys transportation research",
  },
  {
    pageId: "imprint",
    pageTitle: pages.imprint.title,
    excerpt: "Institution, contact, license, and disclaimer information.",
    keywords: "imprint institution contact license disclaimer",
  },
];
