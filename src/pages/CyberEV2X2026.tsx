import CoordinatedAttackModel from "../components/CoordinatedAttackModel";
import DatasetMap from "../components/DatasetMap";
import {
  commonFields,
  comparisonRows,
  datasetDescription,
  datasetLinks,
  downloads,
  formatNumber,
  recordTypes,
  scenarios,
} from "../data/cyberEv2xDataset";
import "../styles/cyber-ev2x-page.css";

function YesNo({ value }: { value: boolean }) {
  return <span className={value ? "cev-yes" : "cev-no"}>{value ? "Yes" : "No"}</span>;
}

export default function CyberEV2X2026() {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div className="cev-page">
      <section id="overview" className="doc-section">
          <div className="cev-logo-row">
            <img className="cev-logo-mark" src={baseUrl + "assets/avt.png"} width={46} height={46} alt="" />
            <span className="badge badge-primary">Dataset release · 2026</span>
          </div>
          <h1>Cyber-EV2X</h1>
          <p>{datasetDescription}</p>
          <p>Explore the simulation scenarios, record types, data preparation, and package structure below. Download the public dataset from <a href={datasetLinks.downloads} target="_blank" rel="noreferrer">Zenodo</a>; the <a href={datasetLinks.github} target="_blank" rel="noreferrer">GitHub repository</a> contains documentation and source code.</p>
          <div className="cev-button-row">
            <a className="button button-secondary" href="#downloads">Dataset Packages</a>
            <a className="button button-secondary" href={datasetLinks.github} target="_blank" rel="noreferrer">View on GitHub</a>
            <a className="button button-secondary" href="#schema">Explore the Data Schema</a>
          </div>

        <h2>Dataset Comparison</h2>
        <p>Selected vehicular and EV-charging cybersecurity datasets compared in the manuscript. “ML-ready” indicates prepared tables.</p>
        <div className="table-wrapper cev-comparison-table" role="region" aria-label="Dataset comparison" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Dataset</th>
                <th scope="col">Communication</th>
                <th scope="col">Feature coverage</th>
                <th scope="col">Traffic scenarios</th>
                <th scope="col">Map</th>
                <th scope="col">ML-ready</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.dataset} className={row.dataset === "Cyber-EV2X" ? "cev-featured-row" : undefined}>
                  <th scope="row">{row.dataset}</th>
                  <td>{row.communication}</td>
                  <td>{row.coverage}</td>
                  <td><YesNo value={row.traffic} /></td>
                  <td>{row.map}</td>
                  <td><YesNo value={row.mlReady} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="simulation" className="doc-section">
        <h2>Simulation Setup</h2>
        <p>Cyber-EV2X uses the 3D Monaco SUMO Traffic (MoST) scenario with SUMO 1.12.0, OMNeT++ 5.6.2, Veins 5.2, and INET 4.2.5. Veins connects traffic mobility and network simulation through TraCI.</p>
        <p>Off-peak and morning-peak traffic each include Normal (A0) and DoS (A1) scenarios. In A1, 10 EV attackers and 10 CS attackers generate application-layer flooding traffic.</p>
        <div className="cev-scenario-grid">
          {scenarios.map((scenario) => (
            <article key={scenario.config} className={scenario.condition === "Attack" ? "is-attack" : undefined}>
              <div>
                <h3>{scenario.name}</h3>
                <code>{scenario.config}</code>
              </div>
              <dl>
                <div><dt>Traffic</dt><dd>{scenario.traffic}</dd></div>
                <div><dt>Window</dt><dd>{formatNumber(scenario.window[0])}–{formatNumber(scenario.window[1])} s</dd></div>
              </dl>
            </article>
          ))}
        </div>
        <figure className="cev-partition-figure">
          <a className="cev-partition-image" href={baseUrl + "assets/methodology.png"} target="_blank" rel="noreferrer" aria-label="Open the co-simulation architecture figure at full resolution">
            <img src={baseUrl + "assets/methodology.png"} width={4019} height={1929} loading="lazy" alt="Cyber-EV2X co-simulation architecture with Environment, Node, and Scenario modules followed by post-processing." />
          </a>
          <figcaption>Cyber-EV2X co-simulation architecture and post-processing flow.</figcaption>
        </figure>
        <p>Explore EV routes and charging-station locations in the Monaco scenario.</p>
        <DatasetMap />
      </section>

      <section id="runs" className="doc-section">
        <h2>Simulation Seeds</h2>
        <p>Cyber-EV2X includes five simulation seeds (<code>r01</code>–<code>r05</code>). Each seed pairs Normal and DoS runs for both traffic periods; paired runs share route and charging-station inputs. The <a href={datasetLinks.github} target="_blank" rel="noreferrer">GitHub repository</a> documents the simulation setup.</p>
      </section>

      <section className="doc-section">
        <h2>Coordinated DoS Attack Model</h2>
        <p>EV and CS attackers send flooding messages alongside benign EV2EV and EV2CS communication. The DoS label identifies the message sender; it does not measure packet loss or receiver failure.</p>
        <CoordinatedAttackModel />
      </section>
      
      <section id="schema" className="doc-section">
        <h2>Data Schema</h2>
        <p>The Core-feature public package contains JSON Lines records prepared from co-simulation output. Type 0 describes an EV's own state; Type 1 and Type 2 are receiver-owned EV2EV and EV2CS observations. Their labels identify message origin, not receiver impact.</p>
        <div className="cev-feature-groups" aria-label="Dataset feature groups">
          {["Energy", "Mobility", "Position", "Signal", "Charging-service"].map((group) => <span key={group}>{group}</span>)}
        </div>
        <p className="cev-common-fields">
          <strong>Common fields:</strong>{" "}
          {commonFields.map((field, index) => (
            <span key={field}><code>{field}</code>{index < commonFields.length - 1 ? ", " : "."}</span>
          ))}{" "}
          <code>send_ts</code> applies to Type 1 and Type 2.
        </p>
        <div className="table-wrapper cev-schema-table" role="region" aria-label="Record type schema" tabIndex={0}>
          <table>
            <thead>
              <tr><th scope="col">Record type</th><th scope="col">Meaning</th><th scope="col">Feature groups</th><th scope="col">Representative fields</th></tr>
            </thead>
            <tbody>
              {recordTypes.map((record) => (
                <tr key={record.id}>
                  <th scope="row">Type {record.id}<span>{record.name}</span></th>
                  <td>{record.description}</td>
                  <td>{record.groups}</td>
                  <td><div className="cev-field-list">{record.fields.map((field) => <code key={field}>{field}</code>)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="cev-schema-notes">
          <li><code>sender_battery</code> is battery energy in Wh, not State of Charge.</li>
          <li><code>sender_step_energy</code> is the step-energy value recorded with an EV2EV message, in Wh.</li>
          <li><code>charging_power</code> is measured in W.</li>
          <li><code>label</code> is cleaning-stage ground truth and must not be used as a predictor.</li>
          <li>A Type 2 reception does not mean that the EV accepted the response or started charging.</li>
        </ul>
        <a className="cev-text-link" href={datasetLinks.schema} target="_blank" rel="noreferrer">Read the full data schema →</a>
      </section>

      <section id="processing" className="doc-section">
        <h2>Post-Processing and Temporal Features</h2>
        <p className="cev-flow" aria-label="Dataset preparation flow">Simulation outputs → Core features → T8 enrichment → ML-ready partitions</p>
        <p>Post-processing prepares Core features and separates EV2EV and EV2CS reception records for the ML-ready datasets.</p>
        <p>The enriched records add eight temporal features (T8) over 10-second sliding windows. T8 summarizes inter-arrival times and packet sizes from logged receptions using their mean, standard deviation, minimum, and maximum.</p>
      </section>

      <section id="partitioning" className="doc-section">
        <h2>Geographic Train/Validation–Test Partitioning</h2>
        <p>After collection and post-processing, the ML-ready EV2EV and EV2CS datasets are divided into training, validation, and test sets. Training/validation and test records come from geographically separated sender-position regions in the Monaco scenario to reduce potential location-dependent bias. Random undersampling balances only training; validation and test retain their original class distributions.</p>
        <figure className="cev-partition-figure">
          <a className="cev-partition-image" href={baseUrl + "assets/separated_regions.png"} target="_blank" rel="noreferrer" aria-label="Open the geographic partition figure at full resolution">
            <img src={baseUrl + "assets/separated_regions.png"} width={4468} height={1420} loading="lazy" alt="Two Monaco traffic maps showing the same separated sender-position regions: blue for training and validation, red for test." />
          </a>
          <figcaption>Geographic train/validation–test partitioning by recorded sender position in the Monaco scenario.</figcaption>
        </figure>
      </section>

      <section id="downloads" className="doc-section">
        <h2>Downloads</h2>
        <p>The public <a href={datasetLinks.downloads} target="_blank" rel="noreferrer">Zenodo record</a> provides three dataset packages.</p>
        <div className="cev-download-list">
          {downloads.map((archive) => (
            <div className="cev-download-row" key={archive.filename}>
              <span className="cev-file-format">{archive.format}</span>
              <span className="cev-download-copy">
                <strong>{archive.name}</strong>
                <span>{archive.description}</span>
                <code>{archive.filename}</code>
                <a className="cev-download-link" href={archive.url} target="_blank" rel="noreferrer">Download ZIP ↗</a>
              </span>
            </div>
          ))}
        </div>
        <div className="cev-resource-links">
          <a href={datasetLinks.downloads} target="_blank" rel="noreferrer">All files on Zenodo ↗</a>
          <a href={datasetLinks.github} target="_blank" rel="noreferrer">GitHub repository ↗</a>
        </div>
      </section>

      <section id="citation-license" className="doc-section">
        <h2>Citation / License</h2>
        <p>Cite the <a href={datasetLinks.downloads} target="_blank" rel="noreferrer">Cyber-EV2X Zenodo record</a> and the dataset version used in your work.</p>
        <div className="cev-license-note">
          <strong>Dataset license: <a href={datasetLinks.license} target="_blank" rel="noreferrer">CC BY 4.0</a></strong>
          <p>Copyright (C) 2026 GRETTIA Lab, UGE University. The dataset license does not automatically apply to source code or third-party assets.</p>
        </div>
      </section>
    </div>
  );
}
