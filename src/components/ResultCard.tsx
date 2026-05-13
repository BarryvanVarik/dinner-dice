import type { RollResult } from "../utils/roll";

type ResultCardProps = {
  result: RollResult | null;
  actionStatus: string;
  isRolling: boolean;
  isFavorite: boolean;
  onRollAgain: () => void;
  onCopy: () => void;
  onCopyShoppingList: () => void;
  onSaveFavorite: () => void;
};

function ResultCard({
  result,
  actionStatus,
  isRolling,
  isFavorite,
  onRollAgain,
  onCopy,
  onCopyShoppingList,
  onSaveFavorite
}: ResultCardProps) {
  if (!result) {
    return (
      <section className={`result-card empty-result${isRolling ? " is-rolling" : ""}`} aria-labelledby="result-title">
        <div className="section-label">
          <span aria-hidden="true">3</span>
          <h2 id="result-title">Recipe idea</h2>
        </div>
        <div className="empty-state">
          <div className={`empty-dice${isRolling ? " is-rolling" : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <p>{isRolling ? "Rolling a dinner idea..." : "Choose a dish mode and roll to get a dinner idea."}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`result-card${isRolling ? " is-rolling" : ""}`} aria-labelledby="result-title">
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
          <button className="secondary-button" type="button" disabled={isRolling} onClick={onRollAgain}>
            {isRolling ? "Rolling..." : "Roll again"}
          </button>
          <button className="secondary-button" type="button" disabled={isRolling} onClick={onSaveFavorite}>
            {isFavorite ? "Saved" : "Save"}
          </button>
          <button className="secondary-button copy-button" type="button" disabled={isRolling} onClick={onCopy}>
            Copy result
          </button>
          <button className="secondary-button copy-button" type="button" disabled={isRolling} onClick={onCopyShoppingList}>
            Shopping list
          </button>
        </div>

        <p className="copy-status" role="status">
          {actionStatus}
        </p>
      </article>
    </section>
  );
}

export default ResultCard;
