import CategoryLock from "./CategoryLock";
import type { DishType } from "../data/dishTypes";
import type { RollResult } from "../utils/roll";

type RollPanelProps = {
  dishType: DishType;
  result: RollResult | null;
  lockedCategories: Set<string>;
  onRoll: () => void;
  onToggleLock: (categoryId: string) => void;
};

function RollPanel({
  dishType,
  result,
  lockedCategories,
  onRoll,
  onToggleLock
}: RollPanelProps) {
  function getRolledCategory(categoryId: string) {
    return result?.rolls.find((roll) => roll.categoryId === categoryId);
  }

  return (
    <section className="roll-panel" aria-labelledby="roll-panel-title">
      <div className="section-label">
        <span aria-hidden="true">2</span>
        <h2 id="roll-panel-title">Roll categories</h2>
      </div>

      <p className="panel-note">
        {dishType.label} rolls {dishType.categories.length} categories. Lock the parts you like, then roll the rest.
      </p>

      <div className="category-grid">
        {dishType.categories.map((category) => (
          <CategoryLock
            key={category.id}
            categoryId={category.id}
            label={category.label}
            options={category.options}
            rolledCategory={getRolledCategory(category.id)}
            isLocked={lockedCategories.has(category.id)}
            onToggleLock={onToggleLock}
          />
        ))}
      </div>

      <button className="roll-button" type="button" onClick={onRoll}>
        {result ? "Roll again" : "Roll dish"}
      </button>
    </section>
  );
}

export default RollPanel;
