import type { RolledCategory } from "../utils/roll";

type CategoryLockProps = {
  categoryId: string;
  label: string;
  options: string[];
  pickCount?: number;
  rolledCategory?: RolledCategory;
  isLocked: boolean;
  isRolling: boolean;
  onToggleLock: (categoryId: string) => void;
};

function CategoryLock({
  categoryId,
  label,
  options,
  pickCount = 1,
  rolledCategory,
  isLocked,
  isRolling,
  onToggleLock
}: CategoryLockProps) {
  const rollCountText = pickCount > 1 ? `Rolls ${pickCount} of ${options.length}` : `${options.length} options`;
  const cardClassName = `category-lock${isRolling ? " is-rolling" : ""}${isLocked ? " is-locked" : ""}`;

  return (
    <article className={cardClassName}>
      <div className="category-lock-top">
        <div>
          <h3>{label}</h3>
          <p>{rollCountText}</p>
        </div>

        <button
          className="lock-toggle"
          type="button"
          disabled={!rolledCategory}
          aria-pressed={isLocked}
          onClick={() => onToggleLock(categoryId)}
        >
          {isLocked ? "Locked" : "Lock"}
        </button>
      </div>

      <div className="category-roll" aria-live="polite">
        {isRolling ? <RollingValue /> : rolledCategory ? rolledCategory.item : "Roll to reveal"}
      </div>
    </article>
  );
}

function RollingValue() {
  return (
    <span className="rolling-value" aria-label="Rolling">
      <span />
      <span />
      <span />
    </span>
  );
}

export default CategoryLock;
