const figureUrl = `${import.meta.env.BASE_URL}assets/ev2x_dos_attack_surface.png`;

export default function CoordinatedAttackModel() {
  return (
    <figure className="cev-attack-figure">
      <a
        className="cev-figure-frame"
        href={figureUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Open the coordinated DoS attack model at full resolution"
      >
        <img
          src={figureUrl}
          width={2465}
          height={1530}
          loading="lazy"
          alt="V2X communication and coordinated DoS attack model. Green links connect benign EVs and a charging station to victim EVs. Red links show flooding messages from EV and charging-station attackers toward victim EVs."
        />
      </a>
      <figcaption>
        Green links show benign EV2EV and EV2CS communication; red links show
        DoS flooding messages from EV and CS attackers toward victim EVs.{" "}
        <a href={figureUrl} target="_blank" rel="noreferrer">
          View full-resolution figure
        </a>
      </figcaption>
    </figure>
  );
}
