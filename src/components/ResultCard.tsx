import type { RollResult } from "../utils/roll";

type ResultCardProps = {
  result: RollResult | null;
  copyStatus: "idle" | "copied" | "failed";
  onRollAgain: () => void;
  onCopy: () => void;
};

function ResultCard({ result, copyStatus, onRollAgain, onCopy }: ResultCardProps) {
  if (!result) {
    return (
      <section className="result-card empty-result" aria-labelledby="result-title">
        <div className="section-label">
          <span aria-hidden="true">3</span>
          <h2 id="result-title">Recipe idea</h2>
        </div>
        <div className="empty-state">
          <p className="empty-dice" aria-hidden="true">D6</p>
          <p>Choose a dish mode and roll to get a dinner idea.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="result-card" aria-labelledby="result-title">
      <div className="section-label">
        <span aria-hidden="true">3</span>
        <h2 id="result-title">Recipe idea</h2>
      </div>

      <article className="recipe-card">
        <p className="result-type">{result.dishTypeLabel}</p>
        <h3>{result.dishName}</h3>

        <dl className="roll-list">
          {result.rolls.map((roll) => (
            <div key={roll.categoryId}>
              <dt>{roll.label}</dt>
              <dd>{roll.item}</dd>
            </div>
          ))}
        </dl>

        <div className="recipe-notes">
          <div>
            <h4>How to make it</h4>
            <p>{result.instruction}</p>
          </div>
          <div>
            <h4>Kid-friendly tweak</h4>
            <p>{result.kidFriendlyTweak}</p>
          </div>
          <div>
            <h4>Upgrade idea</h4>
            <p>{result.upgradeIdea}</p>
          </div>
        </div>

        <div className="result-actions">
          <button className="secondary-button" type="button" onClick={onRollAgain}>
            Roll again
          </button>
          <button className="secondary-button copy-button" type="button" onClick={onCopy}>
            Copy result
          </button>
        </div>

        <p className="copy-status" role="status">
          {copyStatus === "copied" && "Copied to clipboard."}
          {copyStatus === "failed" && "Copy failed. Your browser may be blocking clipboard access."}
        </p>
      </article>
    </section>
  );
}

export default ResultCard;
