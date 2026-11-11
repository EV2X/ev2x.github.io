function Grettia() {
  return (
    <>
      <header className="page-header">
        <p className="page-eyebrow">Institutional Context</p>
        <h1>GRETTIA</h1>
        {/* <p className="page-lead">
          GRETTIA provides the research context for Cyber-EV2X through work on
          intelligent transportation systems, connected mobility, simulation,
          and transport network analysis.
        </p> */}
      </header>

      <section id="about-grettia" className="doc-section">
        <h2>About GRETTIA</h2>
        <p>
          GRETTIA is associated with research on transportation engineering,
          traffic systems, connected vehicles, and mobility services. In the
          Cyber-EV2X context, the group provides a natural home for evaluating
          how communication disruptions affect electric vehicle routing,
          charging behavior, and infrastructure interaction.
        </p>
      </section>

      <section id="research-context" className="doc-section">
        <h2>Research Context</h2>
        <p>
          The dataset sits at the intersection of vehicular networking,
          cybersecurity, electric mobility, and simulation-based evaluation.
          It is designed for reproducible experiments where traffic density,
          attack timing, station overload, and EV energy state can be inspected
          together.
        </p>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Connected Mobility</h3>
            <p>
              EVs exchange beacons, charging requests, and station updates over
              wireless communication channels.
            </p>
          </article>
          <article className="feature-card">
            <h3>Cyber-physical Impact</h3>
            <p>
              Network-layer flooding is connected to routing decisions, charging
              access, and battery consumption.
            </p>
          </article>
        </div>
      </section>

      <section id="cyber-ev2x-project" className="doc-section">
        <h2>Cyber-EV2X Project</h2>
        <p>
          Cyber-EV2X documents EV-to-EV and EV-to-infrastructure communication
          under normal and adversarial conditions. The project is structured as
          a public dataset portal so scenario metadata, schema, release links,
          and citation details remain close to the data.
        </p>
        <div className="callout">
          <div className="callout-title">Research aim</div>
          <p>
            Support transparent analysis of DoS effects in EV charging
            communication and provide high-quality records for anomaly detection
            and security benchmarking.
          </p>
        </div>
      </section>

      <section id="affiliation" className="doc-section">
        <h2>Affiliation</h2>
        <div className="institution-grid">
          <article className="institution-card">
            <h3>Universite Gustave Eiffel</h3>
            <p>COSYS / GRETTIA</p>
          </article>
          <article className="institution-card">
            <h3>Cyber-EV2X Dataset</h3>
            <p>EV2X cybersecurity, simulation, and public documentation.</p>
          </article>
        </div>
      </section>

      <section id="contributors" className="doc-section">
        <h2>Contributors</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Contribution</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cong Son Duong</td>
                <td>Dataset maintainer</td>
                <td>Simulation design, DoS scenario modeling, documentation.</td>
              </tr>
              <tr>
                <td>GRETTIA contributors</td>
                <td>Research supervision</td>
                <td>Transportation systems context and dataset validation.</td>
              </tr>
              <tr>
                <td>Open research community</td>
                <td>Future users</td>
                <td>Benchmarking, citation, issues, and reproducibility feedback.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default Grettia;
