import { useEffect, useMemo, useRef, useState } from "react";
import DishSelector from "./components/DishSelector";
import FavoriteResults from "./components/FavoriteResults";
import IngredientEditor from "./components/IngredientEditor";
import LanguageSelector from "./components/LanguageSelector";
import ResultCard from "./components/ResultCard";
import RollPanel from "./components/RollPanel";
import { dishTypes as defaultDishTypes, type DishId, type DishType } from "./data/dishTypes";
import { getUiText, type LanguageCode } from "./data/i18n";
import { initializeAnalytics, trackEvent } from "./utils/analytics";
import { createCopyText, createShoppingListText, localizeResult, rollDish, type RollResult } from "./utils/roll";

const INGREDIENT_STORAGE_KEY = "dinnerDiceDishTypesV2";
const FAVORITES_STORAGE_KEY = "dinnerDiceFavoritesV1";
const LANGUAGE_STORAGE_KEY = "dinnerDiceLanguageV1";
const ROLL_ANIMATION_MS = 1050;

function App() {
  const [dishTypes, setDishTypes] = useState<DishType[]>(loadDishTypes);
  const [favorites, setFavorites] = useState<RollResult[]>(loadFavoriteResults);
  const [language, setLanguage] = useState<LanguageCode>(loadLanguage);
  const [selectedDishId, setSelectedDishId] = useState<DishId>("pasta");
  const [result, setResult] = useState<RollResult | null>(null);
  const [lockedCategories, setLockedCategories] = useState<Set<string>>(new Set());
  const [actionStatus, setActionStatus] = useState("");
  const [isRolling, setIsRolling] = useState(false);
  const rollTimerRef = useRef<number | null>(null);

  const selectedDish = useMemo(
    () => dishTypes.find((dishType) => dishType.id === selectedDishId) ?? dishTypes[0],
    [dishTypes, selectedDishId]
  );

  const resultDish = useMemo(
    () => dishTypes.find((dishType) => dishType.id === result?.dishTypeId) ?? selectedDish,
    [dishTypes, result?.dishTypeId, selectedDish]
  );
  const localizedResult = useMemo(
    () => (result ? localizeResult(result, resultDish, language) : null),
    [language, result, resultDish]
  );
  const text = getUiText(language);

  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    return () => {
      if (rollTimerRef.current) {
        window.clearTimeout(rollTimerRef.current);
      }
    };
  }, []);

  function handleDishSelect(dishId: DishId) {
    clearPendingRoll();
    setSelectedDishId(dishId);
    setResult(null);
    setLockedCategories(new Set());
    setActionStatus("");
    setIsRolling(false);
    trackEvent("Dish Selected", { dishType: dishId });
  }

  function handleLanguageSelect(nextLanguage: LanguageCode) {
    setLanguage(nextLanguage);
    saveLanguage(nextLanguage);
    setActionStatus("");
  }

  function handleRoll() {
    if (isRolling) {
      return;
    }

    clearPendingRoll();
    setActionStatus("");
    setIsRolling(true);

    rollTimerRef.current = window.setTimeout(() => {
      setResult((currentResult) => rollDish(selectedDish, currentResult, lockedCategories, language));
      setIsRolling(false);
      rollTimerRef.current = null;
      trackEvent("Roll Dish", {
        dishType: selectedDish.label,
        lockedCategories: lockedCategories.size
      });
    }, ROLL_ANIMATION_MS);
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
    if (!localizedResult) {
      return;
    }

    try {
      await copyText(createCopyText(localizedResult, language));
      setActionStatus(text.copiedResult);
      trackEvent("Copy Result", { dishType: localizedResult.dishTypeLabel });
    } catch {
      setActionStatus(text.copyFailed);
    }
  }

  async function handleCopyShoppingList() {
    if (!localizedResult) {
      return;
    }

    try {
      await copyText(createShoppingListText(localizedResult, language));
      setActionStatus(text.copiedShoppingList);
      trackEvent("Shopping List", { dishType: localizedResult.dishTypeLabel });
    } catch {
      setActionStatus(text.copyFailed);
    }
  }

  function handleSaveFavorite() {
    if (!result) {
      return;
    }

    const nextFavorites = [
      result,
      ...favorites.filter((favorite) => getResultKey(favorite) !== getResultKey(result))
    ].slice(0, 8);

    setFavorites(nextFavorites);
    saveFavoriteResults(nextFavorites);
    setActionStatus(text.savedFavorite);
    trackEvent("Save Favorite", { dishType: localizedResult?.dishTypeLabel ?? result.dishTypeLabel });
  }

  function handleLoadFavorite(favorite: RollResult) {
    clearPendingRoll();
    setSelectedDishId(favorite.dishTypeId);
    setResult(favorite);
    setLockedCategories(new Set());
    setActionStatus("");
    setIsRolling(false);
  }

  function handleRemoveFavorite(resultKey: string) {
    const nextFavorites = favorites.filter((favorite) => getResultKey(favorite) !== resultKey);
    setFavorites(nextFavorites);
    saveFavoriteResults(nextFavorites);
  }

  function handleSaveIngredients(updates: Record<string, string[]>) {
    clearPendingRoll();
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
    setActionStatus("");
    setIsRolling(false);
  }

  function handleResetSelectedDish() {
    clearPendingRoll();
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
    setActionStatus("");
    setIsRolling(false);
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">dishtoss</p>
          <h1>dishtoss</h1>
          <p className="subtitle">{text.subtitle}</p>
          <div className="hero-chips" aria-hidden="true">
            {text.chips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        </div>
        <div className="hero-side">
          <LanguageSelector
            language={language}
            label={text.languageLabel}
            onChange={handleLanguageSelect}
          />
          <div className={`dice-badge${isRolling ? " is-rolling" : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </header>

      <DishSelector
        dishTypes={dishTypes}
        selectedDishId={selectedDishId}
        language={language}
        onSelect={handleDishSelect}
      />

      <div className="workspace">
        <RollPanel
          dishType={selectedDish}
          result={result}
          lockedCategories={lockedCategories}
          isRolling={isRolling}
          language={language}
          onRoll={handleRoll}
          onToggleLock={handleToggleLock}
        />

        <ResultCard
          result={localizedResult}
          actionStatus={actionStatus}
          isRolling={isRolling}
          isFavorite={result ? favorites.some((favorite) => getResultKey(favorite) === getResultKey(result)) : false}
          language={language}
          onRollAgain={handleRoll}
          onCopy={handleCopy}
          onCopyShoppingList={handleCopyShoppingList}
          onSaveFavorite={handleSaveFavorite}
        />
      </div>

      <FavoriteResults
        favorites={favorites}
        language={language}
        onLoad={handleLoadFavorite}
        onRemove={handleRemoveFavorite}
      />

      <IngredientEditor
        dishType={selectedDish}
        language={language}
        onSave={handleSaveIngredients}
        onReset={handleResetSelectedDish}
      />
    </main>
  );

  function clearPendingRoll() {
    if (rollTimerRef.current) {
      window.clearTimeout(rollTimerRef.current);
      rollTimerRef.current = null;
    }
  }
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

function loadFavoriteResults() {
  try {
    const storedValue = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) as RollResult[] : [];
  } catch {
    return [];
  }
}

function saveFavoriteResults(favorites: RollResult[]) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

function loadLanguage(): LanguageCode {
  const storedValue = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return storedValue === "nl" || storedValue === "da" || storedValue === "en" ? storedValue : "en";
}

function saveLanguage(language: LanguageCode) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

async function copyText(value: string) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fall back for browsers that expose Clipboard API but block it in the current context.
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const copied = document.execCommand("copy");

    if (!copied) {
      throw new Error("Copy command failed");
    }
  } finally {
    document.body.removeChild(textArea);
  }
}

function getResultKey(result: RollResult) {
  return `${result.dishTypeId}:${result.rolls.map((roll) => `${roll.categoryId}=${roll.item}`).join("|")}`;
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
