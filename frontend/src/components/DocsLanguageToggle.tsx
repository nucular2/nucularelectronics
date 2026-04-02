import { useEffect, useState } from "react";

export type DocsLanguage = "en" | "ru";

const STORAGE_KEY = "docsLanguage";

export function getInitialDocsLanguage(): DocsLanguage {
  if (typeof window === "undefined") return "en";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === "ru" ? "ru" : "en";
}

export function useDocsLanguage() {
  const [language, setLanguage] = useState<DocsLanguage>(() => getInitialDocsLanguage());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
      window.dispatchEvent(new CustomEvent("docsLanguageChange", { detail: language }));
    } catch {}
  }, [language]);

  useEffect(() => {
    const handle = (e: Event) => {
      const next = getInitialDocsLanguage();
      setLanguage(next);
    };

    window.addEventListener("storage", handle);
    window.addEventListener("docsLanguageChange", handle);
    return () => {
      window.removeEventListener("storage", handle);
      window.removeEventListener("docsLanguageChange", handle);
    };
  }, []);

  return { language, setLanguage };
}

export default function DocsLanguageToggle() {
  const { language, setLanguage } = useDocsLanguage();

  return (
    <div className="docs-lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={language === "en" ? "docs-lang-pill docs-lang-pill--active" : "docs-lang-pill"}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={language === "ru" ? "docs-lang-pill docs-lang-pill--active" : "docs-lang-pill"}
        onClick={() => setLanguage("ru")}
      >
        RU
      </button>
    </div>
  );
}
