import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import DocsLanguageToggle, { useDocsLanguage } from "../components/DocsLanguageToggle";
import DocsBlocks from "../components/docs/DocsBlocks";
import type { NewsBlock } from "../context/NewsContext";
import { searchItems as searchInItems, type SearchItem as SearchIndexItem } from "../utils/search";
import "./ControllerSettings.css";
import "./SettingsDocPage.css";

type ControllerTab =
  | "config-files"
  | "fault-diagnosis"
  | "configuration-examples"
  | "brake-lights-and-fans"
  | "wiring-diagram"
  | "controller-setup";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildSearchItems(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const headings = Array.from(doc.querySelectorAll("h2[id], h3[id]")) as HTMLHeadingElement[];
  const items: SearchIndexItem[] = [];

  for (const heading of headings) {
    const id = heading.id;
    const label = (heading.textContent ?? "").trim();
    if (!id || !label) continue;

    let text = "";
    let node: Element | null = heading.nextElementSibling;
    while (node) {
      if (node.matches("h2, h3")) break;
      if (node.matches("p, li")) {
        const part = (node.textContent ?? "").trim();
        if (part) text += (text ? " " : "") + part;
      }
      node = node.nextElementSibling;
    }

    items.push({ id, label, text });
  }

  return items;
}

function buildTocItems(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const headings = Array.from(doc.querySelectorAll("h2[id], h3[id]")) as HTMLHeadingElement[];
  return headings
    .map((h) => ({
      id: h.id,
      label: (h.textContent ?? "").trim(),
      level: h.tagName.toLowerCase(),
    }))
    .filter((h) => Boolean(h.id && h.label));
}

function buildSearchItemsFromBlocks(blocks: NewsBlock[]) {
  const items: SearchIndexItem[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type !== "heading") continue;
    const id = b.id;
    const label = (b.text ?? "").trim();
    if (!id || !label) continue;
    let text = "";
    for (let j = i + 1; j < blocks.length; j++) {
      const next = blocks[j];
      if (next.type === "heading") break;
      if (next.type === "paragraph") text += (text ? " " : "") + next.text;
      if (next.type === "list") text += (text ? " " : "") + (Array.isArray(next.items) ? next.items.join(" ") : "");
    }
    items.push({ id, label, text });
  }
  return items;
}

function buildTocItemsFromBlocks(blocks: NewsBlock[]) {
  return blocks
    .filter((b) => b.type === "heading")
    .map((b) => ({
      id: b.id,
      label: (b.text ?? "").trim(),
      level: `h${b.level || 2}`,
    }))
    .filter((x) => Boolean(x.id && x.label));
}

export default function ControllerSettingsTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useDocsLanguage();
  const [activeTab, setActiveTab] = useState<ControllerTab>("controller-setup");
  const [query, setQuery] = useState("");
  const [searchPhase, setSearchPhase] = useState<"idle" | "loading" | "done">("idle");
  const [html, setHtml] = useState<string>("");
  const [blocks, setBlocks] = useState<NewsBlock[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const tabs = useMemo(() => {
    return [
      {
        key: "config-files" as const,
        label: language === "ru" ? "Файлы настроек" : "Configuration files",
        hash: "#configuration-files",
        slug: "controller-config-files",
        legacyHtmlPath: "/docs/settings-pages/controller-config-files/content.html",
      },
      {
        key: "fault-diagnosis" as const,
        label: language === "ru" ? "Диагностика неисправностей" : "Controller fault diagnosis",
        hash: "#controller-fault-diagnosis",
        slug: "controller-diagnostics",
        legacyHtmlPath: "/docs/settings-pages/controller-diagnostics/content.html",
      },
      {
        key: "configuration-examples" as const,
        label: language === "ru" ? "Примеры настроек" : "Configuration examples",
        hash: "#configuration-examples",
        slug: "controller-examples",
        legacyHtmlPath: "/docs/settings-pages/controller-examples/content.html",
      },
      {
        key: "brake-lights-and-fans" as const,
        label: language === "ru" ? "Стоп-сигналы и вентиляторы" : "Connecting brake lights and fans",
        hash: "#connecting-brake-lights-and-fans",
        slug: "controller-light-fan-pwm",
        legacyHtmlPath: "/docs/settings-pages/controller-light-fan-pwm/content.html",
      },
      {
        key: "wiring-diagram" as const,
        label: language === "ru" ? "Схема подключения" : "Wiring diagram",
        hash: "#wiring-diagram",
        slug: "connection-schematic",
        legacyHtmlPath: "/docs/settings-pages/connection-schematic/content.html",
      },
      {
        key: "controller-setup" as const,
        label: language === "ru" ? "Настройка контроллера" : "Controller setup",
        hash: "#controller-setup",
        slug: "controller-setup",
        legacyHtmlPath: "/docs/settings-pages/controller-setup/content.html",
      },
    ] as const;
  }, [language]);

  useEffect(() => {
    const hash = location.hash;
    const match = tabs.find((t) => t.hash === hash);
    if (!match) return;
    setActiveTab(match.key);
  }, [location.hash, tabs]);

  const active = tabs.find((t) => t.key === activeTab) ?? tabs[tabs.length - 1];

  useEffect(() => {
    setQuery("");
    setSearchPhase("idle");
    setHtml("");
    setBlocks(null);
    setLoadError(null);

    const langPath = `/docs/settings-pages/${active.slug}/${language}/content.html`;
    const legacyPath = active.legacyHtmlPath;

    let isActive = true;
    let cmsHasBlocks = false;

    fetch(`/api/content/docs?slug=${encodeURIComponent(active.slug)}&lang=${encodeURIComponent(language)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!isActive) return;
        if (data?.ok && Array.isArray(data?.blocks) && data.blocks.length > 0) {
          cmsHasBlocks = true;
          setBlocks(data.blocks);
          setHtml("");
        }
      })
      .catch(() => {});

    fetch(langPath)
      .then((r) => {
        if (!r.ok) return fetch(legacyPath);
        return r;
      })
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load (${r.status})`);
        return r.text();
      })
      .then((text) => {
        if (!isActive) return;
        if (cmsHasBlocks) return;
        if (language === "ru" && text.trim().length < 400) {
          fetch(`/docs/settings-pages/${active.slug}/en/content.html`)
            .then((r) => (r.ok ? r.text() : text))
            .then((fallback) => {
              if (!isActive) return;
              if (cmsHasBlocks) return;
              setHtml(fallback);
            })
            .catch(() => {
              if (!isActive) return;
              if (cmsHasBlocks) return;
              setHtml(text);
            });
          return;
        }
        setHtml(text);
      })
      .catch((e) => {
        if (!isActive) return;
        setLoadError("Failed to load page");
      });

    return () => {
      isActive = false;
    };
  }, [active.legacyHtmlPath, active.slug, language]);

  const searchItems = useMemo(() => {
    if (blocks && blocks.length > 0) return buildSearchItemsFromBlocks(blocks);
    if (html) return buildSearchItems(html);
    return [];
  }, [blocks, html]);

  const tocItems = useMemo(() => {
    if (blocks && blocks.length > 0) return buildTocItemsFromBlocks(blocks);
    if (html) return buildTocItems(html);
    return [];
  }, [blocks, html]);

  const searchResults = useMemo(() => searchInItems(searchItems, query, 8), [query, searchItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchPhase("loading");
    window.setTimeout(() => {
      setSearchPhase("done");
    }, 250);
  };

  return (
    <>
      <Header variant="white" />
      <div className="support-page">
        <div className="support-container">
          <div className="support-breadcrumb">
            <button type="button" className="support-breadcrumb-link" onClick={() => navigate("/support")}>
              Support
            </button>
            <span className="support-breadcrumb-separator">/</span>
            <button type="button" className="support-breadcrumb-link" onClick={() => navigate("/settings")}>
              Settings
            </button>
            <span className="support-breadcrumb-separator">/</span>
            <span className="support-breadcrumb-current">Controller</span>
            <DocsLanguageToggle />
          </div>

          <form className="support-search-row" onSubmit={handleSubmit}>
            <div className="support-search-stack">
              <div className={`support-search-input ${query.trim() ? "support-search-input--filled" : ""}`}>
                <svg className="support-search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.7528 15.8408C13.1916 17.1559 11.1755 17.9484 8.97435 17.9484C4.01795 17.9484 0 13.9305 0 8.97418C0 4.01788 4.01795 0 8.97435 0C13.9307 0 17.9487 4.01788 17.9487 8.97418C17.9487 11.1755 17.1561 13.1917 15.8407 14.753L19.7747 18.6869C20.0751 18.9873 20.0751 19.4743 19.7747 19.7747C19.4743 20.0751 18.9872 20.0751 18.6868 19.7747L14.7528 15.8408ZM1.53846 8.97418C1.53846 4.86753 4.86762 1.53843 8.97435 1.53843C13.0811 1.53843 16.4102 4.86753 16.4102 8.97418C16.4102 10.9858 15.6114 12.8108 14.3138 14.1493C14.2829 14.1721 14.2533 14.1975 14.2253 14.2254C14.1974 14.2534 14.172 14.2829 14.1493 14.3138C12.8107 15.6113 10.9858 16.4099 8.97435 16.4099C4.86762 16.4099 1.53846 13.0808 1.53846 8.97418Z"
                    fill="#B0B0B0"
                  />
                </svg>
                <input
                  className="support-search-field"
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (searchPhase !== "idle") setSearchPhase("idle");
                  }}
                  placeholder={language === "ru" ? "Что вы ищете?" : "What are you looking for?"}
                />
                {query.trim() ? (
                  <button
                    type="button"
                    className="support-search-clear"
                    aria-label={language === "ru" ? "Очистить поиск" : "Clear search"}
                    onClick={() => {
                      setQuery("");
                      setSearchPhase("idle");
                    }}
                  >
                    ×
                  </button>
                ) : null}
              </div>
              {query.trim() ? (
                <div className="support-search-results">
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map((item) => (
                        <button
                          key={item.id}
                          className="support-search-result-item"
                          type="button"
                          onClick={() => {
                            setQuery("");
                            setSearchPhase("idle");
                            scrollToId(item.id);
                          }}
                        >
                          <div className="support-search-result-title">{item.label}</div>
                          {item.snippet ? <div className="support-search-result-snippet">{item.snippet}</div> : null}
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="support-search-not-found">{language === "ru" ? "Ничего не найдено" : "Not found"}</div>
                  )}
                </div>
              ) : null}
            </div>
            <button
              className={`support-search-button ${searchPhase === "loading" ? "is-loading" : ""} ${
                searchPhase === "done" ? "is-done" : ""
              }`}
              type="submit"
              disabled={searchPhase !== "idle"}
            >
              {language === "ru" ? "Поиск" : "Search"}
            </button>
          </form>

          <div className="controller-layout">
            <div className="controller-list">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={
                    activeTab === t.key ? "controller-list-item controller-list-item-active" : "controller-list-item"
                  }
                  onClick={() => {
                    setActiveTab(t.key);
                    navigate(`/settings/controller${t.hash}`);
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="controller-content-wrap">
              <div className="controller-content">
                {loadError ? (
                  <div className="controller-content-text">{loadError}</div>
                ) : blocks && blocks.length > 0 ? (
                  <div className="settings-doc-content">
                    <DocsBlocks blocks={blocks} />
                  </div>
                ) : html ? (
                  <div className="settings-doc-content" dangerouslySetInnerHTML={{ __html: html }} />
                ) : (
                  <div className="controller-content-text">Loading...</div>
                )}
              </div>
            </div>

            {tocItems.length > 0 ? (
              <div className="controller-page-toc">
                <div className="controller-page-toc-title">{language === "ru" ? "На этой странице" : "On this page"}</div>
                {tocItems.slice(0, 14).map((item) => (
                  <div
                    key={item.id}
                    className="controller-page-toc-item"
                    onClick={() => scrollToId(item.id)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
