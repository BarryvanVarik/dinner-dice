import { languages, type LanguageCode } from "../data/i18n";

type LanguageSelectorProps = {
  language: LanguageCode;
  label: string;
  onChange: (language: LanguageCode) => void;
};

function LanguageSelector({ language, label, onChange }: LanguageSelectorProps) {
  return (
    <div className="language-switcher" aria-label={label}>
      {languages.map((option) => (
        <button
          key={option.code}
          type="button"
          aria-pressed={language === option.code}
          onClick={() => onChange(option.code)}
        >
          {option.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default LanguageSelector;
