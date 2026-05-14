import { getUiText, type LanguageCode, translateDish } from "../data/i18n";
import type { RollResult } from "../utils/roll";

type FavoriteResultsProps = {
  favorites: RollResult[];
  language: LanguageCode;
  onLoad: (favorite: RollResult) => void;
  onRemove: (resultKey: string) => void;
};

function FavoriteResults({ favorites, language, onLoad, onRemove }: FavoriteResultsProps) {
  const text = getUiText(language);

  if (favorites.length === 0) {
    return null;
  }

  return (
    <details className="favorites-panel">
      <summary>
        <span>{text.favorites}</span>
        <span>{favorites.length}</span>
      </summary>

      <ul className="favorite-list">
        {favorites.map((favorite) => {
          const resultKey = getResultKey(favorite);

          return (
            <li key={resultKey}>
              <button className="favorite-load" type="button" onClick={() => onLoad(favorite)}>
                <span>{favorite.dishName}</span>
                <small>{translateDish(favorite.dishTypeId, language).label}</small>
              </button>
              <button className="favorite-remove" type="button" onClick={() => onRemove(resultKey)}>
                {text.remove}
              </button>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

function getResultKey(result: RollResult) {
  return `${result.dishTypeId}:${result.rolls.map((roll) => `${roll.categoryId}=${roll.item}`).join("|")}`;
}

export default FavoriteResults;
