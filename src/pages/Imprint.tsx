import { datasetLinks } from "../data/cyberEv2xDataset";

function Imprint() {
  return (
    <>
      <header className="page-header">
        <p className="page-eyebrow">Legal Information</p>
        <h1>Imprint</h1>
        <p className="page-lead">Institutional, contact, and license information for Cyber-EV2X.</p>
      </header>

      <section id="institution" className="doc-section">
        <h2>Institution</h2>
        <div className="institution-grid">
          <article className="institution-card">
            <h3>Université Gustave Eiffel</h3>
            <p>COSYS / GRETTIA</p>
          </article>
          <article className="institution-card">
            <h3>Research Area</h3>
            <p>Intelligent transportation systems, connected electric vehicles, and cybersecurity simulation.</p>
          </article>
        </div>
      </section>

      <section id="contact" className="doc-section">
        <h2>Contact</h2>
        <p>Use the project repository for dataset questions, documentation corrections, and reproducibility issues.</p>
        <a
          className="button button-secondary"
          href={datasetLinks.github}
          target="_blank"
          rel="noreferrer"
        >
          GitHub repository
        </a>
      </section>

      <section id="license" className="doc-section">
        <h2>License</h2>
        <p>
          The dataset is licensed under{" "}
          <a href={datasetLinks.license} target="_blank" rel="noreferrer">CC BY 4.0</a>.
          This license does not automatically apply to source code or third-party assets.
        </p>
      </section>

      <section id="disclaimer" className="doc-section">
        <h2>Disclaimer</h2>
        <div className="warning-callout">
          <div className="callout-title">Research dataset notice</div>
          <p>Cyber-EV2X is a co-simulation dataset, not a measurement of an operational EV charging network or road infrastructure.</p>
        </div>
        <div className="danger-callout">
          <div className="callout-title">Security scenario notice</div>
          <p>DoS descriptions document controlled simulation scenarios for defensive research and reproducibility.</p>
        </div>
      </section>
    </>
  );
}

export default Imprint;
