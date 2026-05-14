import { getUiText, type LanguageCode, translateCategory } from "../data/i18n";
import { displayRollItem } from "../utils/roll";
import type { RolledCategory } from "../utils/roll";

type CategoryLockProps = {
  categoryId: string;
  label: string;
  options: string[];
  pickCount?: number;
  rolledCategory?: RolledCategory;
  isLocked: boolean;
  isRolling: boolean;
  language: LanguageCode;
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
  language,
  onToggleLock
}: CategoryLockProps) {
  const text = getUiText(language);
  const rollCountText = pickCount > 1 ? text.rollsOf(pickCount, options.length) : text.options(options.length);
  const cardClassName = `category-lock${isRolling ? " is-rolling" : ""}${isLocked ? " is-locked" : ""}`;

  return (
    <article className={cardClassName}>
      <div className="category-lock-top">
        <div>
          <h3>{translateCategory(categoryId, label, language)}</h3>
          <p>{rollCountText}</p>
        </div>

        <button
          className="lock-toggle"
          type="button"
          disabled={!rolledCategory}
          aria-pressed={isLocked}
          onClick={() => onToggleLock(categoryId)}
        >
          {isLocked ? text.locked : text.lock}
        </button>
      </div>

      <div className="category-roll" aria-live="polite">
        {isRolling ? <RollingValue label={text.rolling} /> : rolledCategory ? displayRollItem(rolledCategory, language) : text.rollToReveal}
      </div>
    </article>
  );
}

function RollingValue({ label }: { label: string }) {
  return (
    <span className="rolling-value" aria-label={label}>
      <span />
      <span />
      <span />
    </span>
  );
}

export default CategoryLock;
