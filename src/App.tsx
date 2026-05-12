import { useMemo, useState } from "react";
import DishSelector from "./components/DishSelector";
import ResultCard from "./components/ResultCard";
import RollPanel from "./components/RollPanel";
import { dishTypes, type DishId } from "./data/dishTypes";
import { createCopyText, rollDish, type RollResult } from "./utils/roll";

function App() {
  const [selectedDishId, setSelectedDishId] = useState<DishId>("pasta");
  const [result, setResult] = useState<RollResult | null>(null);
  const [lockedCategories, setLockedCategories] = useState<Set<string>>(new Set());
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const selectedDish = useMemo(
    () => dishTypes.find((dishType) => dishType.id === selectedDishId) ?? dishTypes[0],
    [selectedDishId]
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

      <DishSelector selectedDishId={selectedDishId} onSelect={handleDishSelect} />

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
    </main>
  );
}

export default App;
