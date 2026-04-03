import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import DocsLanguageToggle, { useDocsLanguage } from "../components/DocsLanguageToggle";
import DocsBlocks from "../components/docs/DocsBlocks";
import type { NewsBlock } from "../context/NewsContext";
import { searchItems as searchInItems, type SearchItem as SearchIndexItem } from "../utils/search";
import "./ControllerSettings.css";
import "./SettingsDocPage.css";

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

export default function SettingsDocPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { language } = useDocsLanguage();
  const [query, setQuery] = useState("");
  const [searchPhase, setSearchPhase] = useState<"idle" | "loading" | "done">("idle");
  const [html, setHtml] = useState<string>("");
  const [blocks, setBlocks] = useState<NewsBlock[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const docs = useMemo(
    () => ({
      bluetooth: {
        title: language === "ru" ? "Bluetooth" : "Bluetooth",
        htmlPath: "/docs/settings-pages/bluetooth/content.html",
      },
      "cad-models": {
        title: language === "ru" ? "CAD файлы / 3D модели" : "CAD files / 3D models",
        htmlPath: "/docs/settings-pages/cad-models/content.html",
      },
      "onboard-computer": {
        title: language === "ru" ? "Бортовой компьютер" : "On-board computer",
        htmlPath: "/docs/settings-pages/onboard-computer/content.html",
      },
      ulight: { title: language === "ru" ? "uLight" : "uLight", htmlPath: "/docs/settings-pages/ulight/content.html" },
      firmware: { title: language === "ru" ? "Прошивки" : "Firmware", htmlPath: "/docs/settings-pages/firmware/content.html" },
      "motor-information": {
        title: language === "ru" ? "Информация по моторам" : "Motor information",
        htmlPath: "/docs/settings-pages/motor-information/content.html",
      },
      usb2can: {
        title: language === "ru" ? "USB2CAN модуль" : "USB2CAN module",
        htmlPath: "/docs/settings-pages/usb2can/content.html",
      },
      "connection-schematic": {
        title: language === "ru" ? "Схема подключения" : "Connection schematic",
        htmlPath: "/docs/settings-pages/connection-schematic/content.html",
      },
    }),
    [language]
  );

  const docDef = slug ? docs[slug as keyof typeof docs] : undefined;

  useEffect(() => {
    setQuery("");
    setSearchPhase("idle");
    setHtml("");
    setBlocks(null);
    setLoadError(null);

    if (!docDef) return;

    let isActive = true;
    let cmsHasBlocks = false;
    fetch(`/api/content/docs?slug=${encodeURIComponent(String(slug))}&lang=${encodeURIComponent(language)}`)
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

    const langPath = `/docs/settings-pages/${slug}/${language}/content.html`;
    const legacyPath = docDef.htmlPath;

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
          fetch(`/docs/settings-pages/${slug}/en/content.html`)
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
  }, [docDef, language, slug]);

  const searchItems = useMemo(() => {
    if (blocks && blocks.length > 0) return buildSearchItemsFromBlocks(blocks);
    if (html) return buildSearchItems(html);
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

  if (!docDef) {
    return (
      <>
        <Header variant="white" />
        <div className="support-page">
          <div className="support-container">
            <div className="support-breadcrumb">
              <button type="button" className="support-breadcrumb-link" onClick={() => navigate("/settings")}>
                Settings
              </button>
              <span className="support-breadcrumb-separator">/</span>
              <span className="support-breadcrumb-current">Not found</span>
            </div>
            <div className="controller-content-wrap">
              <div className="controller-content">
                <div className="controller-content-title">Page not found</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

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
            <span className="support-breadcrumb-current">{docDef.title}</span>
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
        </div>
      </div>
    </>
  );
}
