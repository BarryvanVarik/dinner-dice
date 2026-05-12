import { useEffect, useState } from "react";
import type { DishType } from "../data/dishTypes";

type IngredientEditorProps = {
  dishType: DishType;
  onSave: (updates: Record<string, string[]>) => void;
  onReset: () => void;
};

function IngredientEditor({ dishType, onSave, onReset }: IngredientEditorProps) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    setDrafts(
      Object.fromEntries(
        dishType.categories.map((category) => [category.id, category.options.join("\n")])
      )
    );
  }, [dishType]);

  function updateDraft(categoryId: string, value: string) {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [categoryId]: value
    }));
  }

  function handleSave() {
    const updates = Object.fromEntries(
      dishType.categories.map((category) => [
        category.id,
        parseIngredientLines(drafts[category.id] ?? "")
      ])
    );

    onSave(updates);
  }

  return (
    <details className="ingredient-editor">
      <summary>
        <span>Edit ingredient lists</span>
        <span>{dishType.label}</span>
      </summary>

      <div className="editor-body">
        <p className="editor-note">
          Add one ingredient per line. Changes are saved in this browser and used for future rolls.
        </p>

        <div className="editor-grid">
          {dishType.categories.map((category) => (
            <label className="editor-field" key={category.id}>
              <span>{category.label}</span>
              <textarea
                rows={5}
                value={drafts[category.id] ?? ""}
                onChange={(event) => updateDraft(category.id, event.target.value)}
              />
            </label>
          ))}
        </div>

        <div className="editor-actions">
          <button className="secondary-button copy-button" type="button" onClick={handleSave}>
            Save lists
          </button>
          <button className="secondary-button" type="button" onClick={onReset}>
            Reset this dish
          </button>
        </div>
      </div>
    </details>
  );
}

function parseIngredientLines(value: string) {
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length > 0 ? lines : ["Add ingredients here"];
}

export default IngredientEditor;
