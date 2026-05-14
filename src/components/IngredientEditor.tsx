import { useEffect, useState } from "react";
import type { DishType } from "../data/dishTypes";
import { getUiText, type LanguageCode, translateCategory, translateDish } from "../data/i18n";

type IngredientEditorProps = {
  dishType: DishType;
  language: LanguageCode;
  onSave: (updates: Record<string, string[]>) => void;
  onReset: () => void;
};

function IngredientEditor({ dishType, language, onSave, onReset }: IngredientEditorProps) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const text = getUiText(language);
  const dishLabel = translateDish(dishType.id, language).label;

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
        <span>{text.editIngredientLists}</span>
        <span>{dishLabel}</span>
      </summary>

      <div className="editor-body">
        <p className="editor-note">
          {text.editorNote}
        </p>

        <div className="editor-grid">
          {dishType.categories.map((category) => (
            <label className="editor-field" key={category.id}>
              <span>{translateCategory(category.id, category.label, language)}</span>
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
            {text.saveLists}
          </button>
          <button className="secondary-button" type="button" onClick={onReset}>
            {text.resetDish}
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
