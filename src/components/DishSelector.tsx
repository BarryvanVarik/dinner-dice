import { dishTypes, type DishId } from "../data/dishTypes";

type DishSelectorProps = {
  selectedDishId: DishId;
  onSelect: (dishId: DishId) => void;
};

function DishSelector({ selectedDishId, onSelect }: DishSelectorProps) {
  return (
    <section className="dish-selector" aria-labelledby="dish-selector-title">
      <div className="section-label">
        <span aria-hidden="true">1</span>
        <h2 id="dish-selector-title">Pick a dish mode</h2>
      </div>

      <div className="dish-grid" role="list">
        {dishTypes.map((dishType) => {
          const isSelected = dishType.id === selectedDishId;

          return (
            <button
              className="dish-card"
              type="button"
              key={dishType.id}
              aria-pressed={isSelected}
              onClick={() => onSelect(dishType.id)}
            >
              <span className="dish-card-title">{dishType.label}</span>
              <span className="dish-card-description">{dishType.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default DishSelector;
