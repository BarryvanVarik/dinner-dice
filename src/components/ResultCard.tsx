import { getUiText, type LanguageCode, translateCategory } from "../data/i18n";
import { displayRollItem } from "../utils/roll";
import type { RollResult } from "../utils/roll";

type ResultCardProps = {
  result: RollResult | null;
  actionStatus: string;
  isRolling: boolean;
  isFavorite: boolean;
  language: LanguageCode;
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
  language,
  onRollAgain,
  onCopy,
  onCopyShoppingList,
  onSaveFavorite
}: ResultCardProps) {
  const text = getUiText(language);

  if (!result) {
    return (
      <section className={`result-card empty-result${isRolling ? " is-rolling" : ""}`} aria-labelledby="result-title">
        <div className="section-label">
          <span aria-hidden="true">3</span>
          <h2 id="result-title">{text.recipeIdea}</h2>
        </div>
        <div className="empty-state">
          <div className={`empty-dice${isRolling ? " is-rolling" : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <p>{isRolling ? text.rollingIdea : text.chooseAndRoll}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`result-card${isRolling ? " is-rolling" : ""}`} aria-labelledby="result-title">
      <div className="section-label">
        <span aria-hidden="true">3</span>
        <h2 id="result-title">{text.recipeIdea}</h2>
      </div>

      <article className="recipe-card">
        <p className="result-type">{result.dishTypeLabel}</p>
        <h3>{result.dishName}</h3>

        <dl className="roll-list">
          {result.rolls.map((roll) => (
            <div key={roll.categoryId}>
              <dt>{translateCategory(roll.categoryId, roll.label, language)}</dt>
              <dd>{displayRollItem(roll, language)}</dd>
            </div>
          ))}
        </dl>

        <div className="recipe-notes">
          <div>
            <h4>{text.howToMakeIt}</h4>
            <p>{result.instruction}</p>
          </div>
          <div>
            <h4>{text.kidFriendlyTweak}</h4>
            <p>{result.kidFriendlyTweak}</p>
          </div>
          <div>
            <h4>{text.upgradeIdea}</h4>
            <p>{result.upgradeIdea}</p>
          </div>
        </div>

        <div className="result-actions">
          <button className="secondary-button" type="button" disabled={isRolling} onClick={onRollAgain}>
            {isRolling ? text.rolling : text.rollAgain}
          </button>
          <button className="secondary-button" type="button" disabled={isRolling} onClick={onSaveFavorite}>
            {isFavorite ? text.saved : text.save}
          </button>
          <button className="secondary-button copy-button" type="button" disabled={isRolling} onClick={onCopy}>
            {text.copyResult}
          </button>
          <button className="secondary-button copy-button" type="button" disabled={isRolling} onClick={onCopyShoppingList}>
            {text.shoppingList}
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
