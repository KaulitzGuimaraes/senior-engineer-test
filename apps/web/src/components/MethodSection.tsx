export function MethodSection() {
  return (
    <section className="method-section" id="method">
      <div className="shell method-grid">
        <div>
          <p className="eyebrow light">
            <span /> How it works
          </p>
          <h2>Weather, made useful.</h2>
        </div>
        <div className="method-copy">
          <p>
            We translate forecasts into transparent activity scores. Every
            recommendation includes a reason, so you can make the final call
            with confidence.
          </p>
          <div className="method-steps">
            <div>
              <span>01</span>
              <strong>Locate</strong>
              <p>We resolve your destination and local timezone.</p>
            </div>
            <div>
              <span>02</span>
              <strong>Understand</strong>
              <p>Weather and marine conditions are normalised.</p>
            </div>
            <div>
              <span>03</span>
              <strong>Rank</strong>
              <p>Independent scoring strategies compare each activity.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
