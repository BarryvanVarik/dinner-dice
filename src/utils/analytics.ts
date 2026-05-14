type PlausibleEventName =
  | "Dish Selected"
  | "Roll Dish"
  | "Andreas Button"
  | "Copy Result"
  | "Shopping List"
  | "Save Favorite";

type EventProps = Record<string, string | number | boolean>;

type PlausibleFunction = {
  (eventName: PlausibleEventName, options?: { props?: EventProps }): void;
  q?: unknown[];
};

declare global {
  interface Window {
    plausible?: PlausibleFunction;
  }
}

const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
const plausibleScriptSource = import.meta.env.VITE_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";
const plausibleScriptId = "plausible-analytics-script";

export function initializeAnalytics() {
  if (!plausibleDomain || document.getElementById(plausibleScriptId)) {
    return;
  }

  window.plausible =
    window.plausible ||
    ((eventName, options) => {
      window.plausible!.q = window.plausible!.q || [];
      window.plausible!.q.push([eventName, options]);
    });

  const script = document.createElement("script");
  script.id = plausibleScriptId;
  script.defer = true;
  script.dataset.domain = plausibleDomain;
  script.src = plausibleScriptSource;
  document.head.appendChild(script);
}

export function trackEvent(eventName: PlausibleEventName, props?: EventProps) {
  window.plausible?.(eventName, props ? { props } : undefined);
}
