import { useMemo, useState } from "react";
import DishSelector from "./components/DishSelector";
import IngredientEditor from "./components/IngredientEditor";
import ResultCard from "./components/ResultCard";
import RollPanel from "./components/RollPanel";
import { dishTypes as defaultDishTypes, type DishId, type DishType } from "./data/dishTypes";
import { createCopyText, rollDish, type RollResult } from "./utils/roll";

const INGREDIENT_STORAGE_KEY = "dinnerDiceDishTypes";

function App() {
  const [dishTypes, setDishTypes] = useState<DishType[]>(loadDishTypes);
  const [selectedDishId, setSelectedDishId] = useState<DishId>("pasta");
  const [result, setResult] = useState<RollResult | null>(null);
  const [lockedCategories, setLockedCategories] = useState<Set<string>>(new Set());
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const selectedDish = useMemo(
    () => dishTypes.find((dishType) => dishType.id === selectedDishId) ?? dishTypes[0],
    [dishTypes, selectedDishId]
  );

  function handleDishSelect(dishId: DishId) {
    setSelectedDishId(dishId);
    setResult(null);
    setLockedCategories(new Set());
    setCopyStatus("idle");
  }

  function handleRoll() {
    setResult((currentResult) => rollDish(selectedDish, currentResult, lockedCategories));
    setCopyStatus("idle");
  }

  function handleToggleLock(categoryId: string) {
    setLockedCategories((currentLocks) => {
      const nextLocks = new Set(currentLocks);

      if (nextLocks.has(categoryId)) {
        nextLocks.delete(categoryId);
      } else {
        nextLocks.add(categoryId);
      }

      return nextLocks;
    });
  }

  async function handleCopy() {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(createCopyText(result));
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  function handleSaveIngredients(updates: Record<string, string[]>) {
    const nextDishTypes = dishTypes.map((dishType) => {
      if (dishType.id !== selectedDishId) {
        return dishType;
      }

      return {
        ...dishType,
        categories: dishType.categories.map((category) => ({
          ...category,
          options: updates[category.id] ?? category.options
        }))
      };
    });

    setDishTypes(nextDishTypes);
    saveDishTypes(nextDishTypes);
    setResult(null);
    setLockedCategories(new Set());
    setCopyStatus("idle");
  }

  function handleResetSelectedDish() {
    const defaultDish = defaultDishTypes.find((dishType) => dishType.id === selectedDishId);

    if (!defaultDish) {
      return;
    }

    const nextDishTypes = dishTypes.map((dishType) =>
      dishType.id === selectedDishId ? defaultDish : dishType
    );

    setDishTypes(nextDishTypes);
    saveDishTypes(nextDishTypes);
    setResult(null);
    setLockedCategories(new Set());
    setCopyStatus("idle");
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Dinner Dice</p>
          <h1>Dinner Dice</h1>
          <p className="subtitle">Roll your way into dinner</p>
        </div>
        <div className="dice-badge" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </header>

      <DishSelector dishTypes={dishTypes} selectedDishId={selectedDishId} onSelect={handleDishSelect} />

      <div className="workspace">
        <RollPanel
          dishType={selectedDish}
          result={result}
          lockedCategories={lockedCategories}
          onRoll={handleRoll}
          onToggleLock={handleToggleLock}
        />

        <ResultCard
          result={result}
          copyStatus={copyStatus}
          onRollAgain={handleRoll}
          onCopy={handleCopy}
        />
      </div>

      <IngredientEditor
        dishType={selectedDish}
        onSave={handleSaveIngredients}
        onReset={handleResetSelectedDish}
      />
    </main>
  );
}

function loadDishTypes() {
  try {
    const storedValue = localStorage.getItem(INGREDIENT_STORAGE_KEY);

    if (!storedValue) {
      return defaultDishTypes;
    }

    const storedDishTypes = JSON.parse(storedValue) as DishType[];
    return mergeWithDefaults(storedDishTypes);
  } catch {
    return defaultDishTypes;
  }
}

function saveDishTypes(dishTypes: DishType[]) {
  localStorage.setItem(INGREDIENT_STORAGE_KEY, JSON.stringify(dishTypes));
}

function mergeWithDefaults(storedDishTypes: DishType[]) {
  return defaultDishTypes.map((defaultDishType) => {
    const storedDishType = storedDishTypes.find((dishType) => dishType.id === defaultDishType.id);

    if (!storedDishType) {
      return defaultDishType;
    }

    return {
      ...defaultDishType,
      categories: defaultDishType.categories.map((defaultCategory) => {
        const storedCategory = storedDishType.categories.find(
          (category) => category.id === defaultCategory.id
        );

        if (!storedCategory || storedCategory.options.length === 0) {
          return defaultCategory;
        }

        return {
          ...defaultCategory,
          options: storedCategory.options
        };
      })
    };
  });
}

export default App;
