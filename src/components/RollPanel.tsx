import CategoryLock from "./CategoryLock";
import type { DishType } from "../data/dishTypes";
import { getUiText, type LanguageCode, translateDish } from "../data/i18n";
import type { RollResult } from "../utils/roll";

type RollPanelProps = {
  dishType: DishType;
  result: RollResult | null;
  lockedCategories: Set<string>;
  isRolling: boolean;
  language: LanguageCode;
  onRoll: () => void;
  onToggleLock: (categoryId: string) => void;
};

function RollPanel({
  dishType,
  result,
  lockedCategories,
  isRolling,
  language,
  onRoll,
  onToggleLock
}: RollPanelProps) {
  const text = getUiText(language);
  const dishLabel = translateDish(dishType.id, language).label;

  function getRolledCategory(categoryId: string) {
    return result?.rolls.find((roll) => roll.categoryId === categoryId);
  }

  return (
    <section className="roll-panel" aria-labelledby="roll-panel-title">
      <div className="section-label">
        <span aria-hidden="true">2</span>
        <h2 id="roll-panel-title">{text.rollCategories}</h2>
      </div>

      <p className="panel-note">
        {text.rollPanelNote(dishLabel, dishType.categories.length)}
      </p>

      <div className="category-grid">
        {dishType.categories.map((category) => (
          <CategoryLock
            key={category.id}
            categoryId={category.id}
            label={category.label}
            options={category.options}
            pickCount={category.pickCount}
            rolledCategory={getRolledCategory(category.id)}
            isLocked={lockedCategories.has(category.id)}
            isRolling={isRolling && !lockedCategories.has(category.id)}
            language={language}
            onToggleLock={onToggleLock}
          />
        ))}
      </div>

      <button className="roll-button" type="button" disabled={isRolling} onClick={onRoll}>
        {isRolling ? text.rolling : result ? text.rollAgain : text.rollDish}
      </button>
    </section>
  );
}

export default RollPanel;
