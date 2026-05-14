import type { DishId, DishType } from "../data/dishTypes";
import { getUiText, type LanguageCode, translateDish } from "../data/i18n";

type DishSelectorProps = {
  dishTypes: DishType[];
  selectedDishId: DishId;
  language: LanguageCode;
  onSelect: (dishId: DishId) => void;
};

function DishSelector({ dishTypes, selectedDishId, language, onSelect }: DishSelectorProps) {
  const text = getUiText(language);

  return (
    <section className="dish-selector" aria-labelledby="dish-selector-title">
      <div className="section-label">
        <span aria-hidden="true">1</span>
        <h2 id="dish-selector-title">{text.pickDishMode}</h2>
      </div>

      <div className="dish-grid" role="list">
        {dishTypes.map((dishType) => {
          const isSelected = dishType.id === selectedDishId;
          const translatedDish = translateDish(dishType.id, language);

          return (
            <button
              className={`dish-card dish-card-${dishType.id}`}
              type="button"
              key={dishType.id}
              aria-pressed={isSelected}
              onClick={() => onSelect(dishType.id)}
            >
              <span className="dish-visual" aria-hidden="true" />
              <span className="dish-card-title">{translatedDish.label}</span>
              <span className="dish-card-description">{translatedDish.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default DishSelector;
