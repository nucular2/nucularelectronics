import React, { useEffect, useMemo, useState } from "react";
import { getSupabaseAccessTokenOrThrow } from "../../lib/supabase";
import type { NewsBlock } from "../../context/NewsContext";
import DocsBlocks from "../../components/docs/DocsBlocks";
import "../../pages/SettingsDocPage.css";

type DocsLang = "en" | "ru";
type DocsStatus = "draft" | "published";

type DocsPage = {
  slug: string;
  route?: string;
  title: { en: string; ru: string };
  status: { en: DocsStatus; ru: DocsStatus };
  blocks: { en: NewsBlock[]; ru: NewsBlock[] };
  createdAt: number;
  updatedAt: number;
};

type DocsConfig = {
  version: number;
  pages: DocsPage[];
};

const DEFAULT_DOC_PAGES: Array<{ slug: string; titleEn: string; titleRu: string }> = [
  { slug: "bluetooth", titleEn: "Bluetooth", titleRu: "Bluetooth" },
  { slug: "cad-models", titleEn: "CAD files / 3D models", titleRu: "CAD файлы / 3D модели" },
  { slug: "onboard-computer", titleEn: "On-board computer", titleRu: "Бортовой компьютер" },
  { slug: "firmware", titleEn: "Firmware", titleRu: "Прошивки" },
  { slug: "motor-information", titleEn: "Motor information", titleRu: "Информация по моторам" },
  { slug: "usb2can", titleEn: "USB2CAN module", titleRu: "USB2CAN модуль" },
  { slug: "connection-schematic", titleEn: "Connection schematic", titleRu: "Схема подключения" },
  { slug: "controller-setup", titleEn: "Controller setup", titleRu: "Настройка контроллера" },
  { slug: "controller-config-files", titleEn: "Configuration files", titleRu: "Файлы настроек" },
  { slug: "controller-diagnostics", titleEn: "Controller fault diagnosis", titleRu: "Диагностика неисправностей" },
  { slug: "controller-examples", titleEn: "Configuration examples", titleRu: "Примеры настроек" },
  { slug: "controller-light-fan-pwm", titleEn: "Connecting brake lights and fans", titleRu: "Стоп-сигналы и вентиляторы" },
];

const INTERNAL_LINKS: Array<{ label: string; href: string }> = [
  { label: "Settings", href: "/settings" },
  { label: "Settings · Controller", href: "/settings/controller" },
  { label: "Settings · Bluetooth", href: "/settings/bluetooth" },
  { label: "Settings · CAD models", href: "/settings/cad-models" },
  { label: "Settings · Onboard computer", href: "/settings/onboard-computer" },
  { label: "Settings · Firmware", href: "/settings/firmware" },
  { label: "Settings · Motor information", href: "/settings/motor-information" },
  { label: "Settings · Microlight", href: "/settings/microlight" },
  { label: "Settings · USB2CAN", href: "/settings/usb2can" },
  { label: "Support", href: "/support" },
];

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

async function safeReadJson(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { __raw: text };
  }
}

function paragraphTextFromElement(el: HTMLElement) {
  const parts: string[] = [];
  const walk = (node: ChildNode) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const v = (node.textContent || "").replace(/\s+/g, " ");
      if (v) parts.push(v);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const e = node as HTMLElement;
    const tag = e.tagName.toLowerCase();
    if (tag === "br") {
      parts.push("\n");
      return;
    }
    if (tag === "a") {
      const text = (e.textContent || "").trim();
      const href = e.getAttribute("href") || "";
      if (text && href) {
        parts.push(`${text} (${href})`);
        return;
      }
    }
    for (const child of Array.from(e.childNodes)) walk(child);
  };
  for (const child of Array.from(el.childNodes)) walk(child);
  return parts.join("").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function blocksFromStaticHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks: NewsBlock[] = [];

  const visit = (node: Element) => {
    for (const child of Array.from(node.children)) {
      const tag = child.tagName.toLowerCase();
      if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") {
        const text = (child.textContent || "").trim();
        if (!text) continue;
        const level = tag === "h3" ? 3 : tag === "h4" ? 4 : 2;
        const id = (child.getAttribute("id") || "").trim() || newId("h");
        blocks.push({ id, type: "heading", text, level });
        continue;
      }
      if (tag === "hr") {
        blocks.push({ id: newId("d"), type: "divider" });
        continue;
      }
      if (tag === "img") {
        const src = (child.getAttribute("src") || "").trim();
        if (!src) continue;
        const alt = (child.getAttribute("alt") || "").trim();
        blocks.push({ id: newId("img"), type: "image", url: src, alt });
        continue;
      }
      if (tag === "ul" || tag === "ol") {
        const items = Array.from(child.querySelectorAll(":scope > li"))
          .map((li) => (li.textContent || "").trim())
          .filter(Boolean);
        if (items.length > 0) {
          blocks.push({ id: newId("l"), type: "list", items, ordered: tag === "ol" });
        }
        continue;
      }
      if (tag === "p") {
        const imgs = Array.from(child.querySelectorAll("img"));
        for (const img of imgs) {
          const src = (img.getAttribute("src") || "").trim();
          if (!src) continue;
          const alt = (img.getAttribute("alt") || "").trim();
          blocks.push({ id: newId("img"), type: "image", url: src, alt });
        }

        const anchors = Array.from(child.querySelectorAll("a"));
        const onlyLink =
          anchors.length === 1 &&
          (child.textContent || "").trim() === (anchors[0].textContent || "").trim() &&
          Boolean((anchors[0].getAttribute("href") || "").trim());
        if (onlyLink) {
          blocks.push({
            id: newId("a"),
            type: "link",
            text: (anchors[0].textContent || "").trim(),
            href: (anchors[0].getAttribute("href") || "").trim(),
          });
          continue;
        }

        const text = paragraphTextFromElement(child as HTMLElement);
        if (text) blocks.push({ id: newId("p"), type: "paragraph", text });
        continue;
      }
      visit(child);
    }
  };

  visit(doc.body);
  return blocks;
}

async function loadStaticDocBlocks(slug: string, lang: DocsLang) {
  const primary = `/docs/settings-pages/${slug}/${lang}/content.html`;
  const legacy = `/docs/settings-pages/${slug}/content.html`;
  const fallback = `/docs/settings-pages/${slug}/en/content.html`;

  const tryFetch = async (url: string) => {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.text();
  };

  const html = (await tryFetch(primary)) || (await tryFetch(legacy)) || (lang === "ru" ? await tryFetch(fallback) : null);
  if (!html) return [];
  return blocksFromStaticHtml(html);
}

function ensurePage(raw: Partial<DocsPage> & { slug: string }): DocsPage {
  const now = Date.now();
  return {
    slug: raw.slug,
    route: raw.route,
    title: {
      en: raw.title?.en || raw.slug,
      ru: raw.title?.ru || raw.title?.en || raw.slug,
    },
    status: {
      en: raw.status?.en === "published" ? "published" : "draft",
      ru: raw.status?.ru === "published" ? "published" : "draft",
    },
    blocks: {
      en: Array.isArray(raw.blocks?.en) ? (raw.blocks?.en as NewsBlock[]) : [],
      ru: Array.isArray(raw.blocks?.ru) ? (raw.blocks?.ru as NewsBlock[]) : [],
    },
    createdAt: typeof raw.createdAt === "number" ? raw.createdAt : now,
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : now,
  };
}

async function getAdminToken() {
  return await getSupabaseAccessTokenOrThrow();
}

async function uploadImage(file: File) {
  const token = await getAdminToken();
  const form = new FormData();
  form.append("file", file);
  form.append("folder", "support");
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Upload failed");
  }
  const json = await res.json();
  if (!json?.url) throw new Error("No url in response");
  return String(json.url);
}

export default function SupportManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<DocsLang>("en");
  const [config, setConfig] = useState<DocsConfig>({ version: 1, pages: [] });
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [search, setSearch] = useState("");

  const selected = useMemo(() => config.pages.find((p) => p.slug === selectedSlug) || null, [config.pages, selectedSlug]);

  const visiblePages = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = [...config.pages].sort((a, b) => a.slug.localeCompare(b.slug));
    if (!q) return list;
    return list.filter((p) => p.slug.toLowerCase().includes(q) || p.title.en.toLowerCase().includes(q) || p.title.ru.toLowerCase().includes(q));
  }, [config.pages, search]);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const token = await getAdminToken();
        const res = await fetch("/api/admin/docs", { headers: { Authorization: `Bearer ${token}` } });
        const json = await safeReadJson(res);
        if (!res.ok) {
          const msg =
            (json as any)?.message ||
            (typeof (json as any)?.__raw === "string" ? (json as any).__raw.slice(0, 180) : "") ||
            `Failed to load docs (${res.status})`;
          throw new Error(msg);
        }
        const next: DocsConfig =
          (json as any)?.config && typeof (json as any).config === "object" ? (json as any).config : { version: 1, pages: [] };
        const pages = Array.isArray(next.pages) ? next.pages.map((p: any) => ensurePage(p)) : [];
        if (!isActive) return;
        setConfig({ version: typeof next.version === "number" ? next.version : 1, pages });
        setSelectedSlug((prev) => prev || pages[0]?.slug || "");
      } catch (e: any) {
        if (!isActive) return;
        setError(e?.message || String(e));
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = await getAdminToken();
      const res = await fetch("/api/admin/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ config }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Save failed");
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  const updateSelected = (patch: Partial<DocsPage>) => {
    if (!selected) return;
    setConfig((prev) => {
      const pages = prev.pages.map((p) => {
        if (p.slug !== selected.slug) return p;
        return ensurePage({ ...p, ...patch, updatedAt: Date.now(), slug: p.slug });
      });
      return { ...prev, pages };
    });
  };

  const updateBlocks = (nextBlocks: NewsBlock[]) => {
    if (!selected) return;
    updateSelected({
      blocks: { ...selected.blocks, [lang]: nextBlocks },
    });
  };

  const addPage = () => {
    const slug = `page-${Math.random().toString(16).slice(2, 8)}`;
    const page = ensurePage({ slug });
    setConfig((prev) => ({ ...prev, pages: [...prev.pages, page] }));
    setSelectedSlug(slug);
  };

  const deletePage = () => {
    if (!selected) return;
    const ok = window.confirm(`Delete page "${selected.slug}"?`);
    if (!ok) return;
    setConfig((prev) => {
      const pages = prev.pages.filter((p) => p.slug !== selected.slug);
      return { ...prev, pages };
    });
    setSelectedSlug((prev) => {
      if (prev !== selected.slug) return prev;
      const next = config.pages.filter((p) => p.slug !== selected.slug)[0]?.slug || "";
      return next;
    });
  };

  const addBlock = (type: NewsBlock["type"]) => {
    if (!selected) return;
    const list = [...(selected.blocks[lang] || [])];
    if (type === "heading") list.push({ id: newId("h"), type: "heading", text: "Heading", level: 2 });
    if (type === "paragraph") list.push({ id: newId("p"), type: "paragraph", text: "Text" });
    if (type === "list") list.push({ id: newId("l"), type: "list", items: ["Item 1", "Item 2"], ordered: false });
    if (type === "link") list.push({ id: newId("a"), type: "link", href: "/settings", text: "Link" });
    if (type === "image") list.push({ id: newId("img"), type: "image", url: "", alt: "", caption: "" });
    if (type === "divider") list.push({ id: newId("d"), type: "divider" });
    updateBlocks(list);
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    if (!selected) return;
    const list = [...(selected.blocks[lang] || [])];
    const next = index + dir;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    const tmp = copy[index];
    copy[index] = copy[next];
    copy[next] = tmp;
    updateBlocks(copy);
  };

  const removeBlock = (index: number) => {
    if (!selected) return;
    const list = [...(selected.blocks[lang] || [])];
    list.splice(index, 1);
    updateBlocks(list);
  };

  const importFromCurrent = async () => {
    if (!selected) return;
    const href = selected.route || INTERNAL_LINKS.find((x) => x.href.includes(selected.slug))?.href || "";
    if (!href) {
      alert("Set route first");
      return;
    }
    const url = href.startsWith("/") ? href : `/${href}`;
    const res = await fetch(url);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const content = doc.querySelector(".settings-doc-content") || doc.querySelector(".controller-content") || doc.body;
    const blocks: NewsBlock[] = [];

    const nodes = Array.from(content.querySelectorAll("h1,h2,h3,h4,p,ul,ol,img,a,hr"));
    for (const el of nodes) {
      const tag = el.tagName.toLowerCase();
      if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") {
        const text = (el.textContent || "").trim();
        if (!text) continue;
        const level = tag === "h3" ? 3 : tag === "h4" ? 4 : 2;
        blocks.push({ id: newId("h"), type: "heading", text, level });
        continue;
      }
      if (tag === "p") {
        const text = (el.textContent || "").trim();
        if (!text) continue;
        blocks.push({ id: newId("p"), type: "paragraph", text });
        continue;
      }
      if (tag === "ul" || tag === "ol") {
        const items = Array.from(el.querySelectorAll("li")).map((li) => (li.textContent || "").trim()).filter(Boolean);
        if (items.length === 0) continue;
        blocks.push({ id: newId("l"), type: "list", items, ordered: tag === "ol" });
        continue;
      }
      if (tag === "img") {
        const src = (el as HTMLImageElement).getAttribute("src") || "";
        if (!src) continue;
        blocks.push({ id: newId("img"), type: "image", url: src, alt: (el as HTMLImageElement).alt || "" });
        continue;
      }
      if (tag === "a") {
        const href = (el as HTMLAnchorElement).getAttribute("href") || "";
        const text = (el.textContent || "").trim();
        if (!href || !text) continue;
        blocks.push({ id: newId("a"), type: "link", href, text });
        continue;
      }
      if (tag === "hr") {
        blocks.push({ id: newId("d"), type: "divider" });
      }
    }

    updateBlocks(blocks);
  };

  const importDefaultsFromStatic = async () => {
    setSaving(true);
    setError(null);
    try {
      const existing = new Set(config.pages.map((p) => p.slug));
      const created: DocsPage[] = [];
      for (const def of DEFAULT_DOC_PAGES) {
        if (existing.has(def.slug)) continue;
        created.push(
          ensurePage({
            slug: def.slug,
            route: def.slug.startsWith("controller-") || def.slug === "connection-schematic" ? "/settings/controller" : `/settings/${def.slug}`,
            title: { en: def.titleEn, ru: def.titleRu },
            status: { en: "draft", ru: "draft" },
            blocks: { en: [], ru: [] },
          })
        );
      }

      const pages = [...config.pages, ...created];
      for (const p of pages) {
        if (p.blocks.en.length === 0) p.blocks.en = await loadStaticDocBlocks(p.slug, "en");
        if (p.blocks.ru.length === 0) p.blocks.ru = await loadStaticDocBlocks(p.slug, "ru");
      }

      setConfig((prev) => ({ ...prev, pages }));
      setSelectedSlug((prev) => prev || pages[0]?.slug || "");
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-card">Loading…</div>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr 1fr", gap: 16, alignItems: "start" }}>
      <div className="admin-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div className="admin-card-title">Support</div>
            <div className="admin-card-subtitle">Docs pages with draft/publish and preview</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="admin-button" onClick={importDefaultsFromStatic} disabled={saving}>
              Import existing
            </button>
            <button className="admin-button" onClick={addPage}>
              Add
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <input className="admin-input" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          {visiblePages.length > 0 ? (
            visiblePages.map((p) => (
              <button
                key={p.slug}
                className={p.slug === selectedSlug ? "admin-button active" : "admin-button"}
                style={{ justifyContent: "flex-start", textAlign: "left" } as any}
                onClick={() => setSelectedSlug(p.slug)}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ fontWeight: 700 }}>{p.slug}</div>
                  <div className="admin-card-subtitle">{p.title.en}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="admin-muted" style={{ marginTop: 8 }}>
              No pages yet. Click “Import existing” to pull current docs.
            </div>
          )}
        </div>
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div className="admin-card-title">Editor</div>
            <div className="admin-card-subtitle">Cross-links, images, text, preview</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className={lang === "en" ? "admin-button active" : "admin-button"} onClick={() => setLang("en")}>
              EN
            </button>
            <button className={lang === "ru" ? "admin-button active" : "admin-button"} onClick={() => setLang("ru")}>
              RU
            </button>
          </div>
        </div>

        {error ? <div style={{ marginTop: 12, color: "#fca5a5" }}>{error}</div> : null}

        {!selected ? (
          <div style={{ marginTop: 16 }} className="admin-muted">
            Select or create a page
          </div>
        ) : (
          <>
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div className="admin-card-subtitle" style={{ marginBottom: 6 }}>
                  Slug
                </div>
                <input className="admin-input" value={selected.slug} disabled />
              </div>
              <div>
                <div className="admin-card-subtitle" style={{ marginBottom: 6 }}>
                  Route (optional)
                </div>
                <input
                  className="admin-input"
                  value={selected.route || ""}
                  onChange={(e) => updateSelected({ route: e.target.value })}
                  placeholder="/settings/bluetooth"
                />
              </div>
              <div>
                <div className="admin-card-subtitle" style={{ marginBottom: 6 }}>
                  Title (EN)
                </div>
                <input
                  className="admin-input"
                  value={selected.title.en}
                  onChange={(e) => updateSelected({ title: { ...selected.title, en: e.target.value } })}
                />
              </div>
              <div>
                <div className="admin-card-subtitle" style={{ marginBottom: 6 }}>
                  Title (RU)
                </div>
                <input
                  className="admin-input"
                  value={selected.title.ru}
                  onChange={(e) => updateSelected({ title: { ...selected.title, ru: e.target.value } })}
                />
              </div>
              <div>
                <div className="admin-card-subtitle" style={{ marginBottom: 6 }}>
                  Status ({lang.toUpperCase()})
                </div>
                <select
                  className="admin-input"
                  value={selected.status[lang]}
                  onChange={(e) => updateSelected({ status: { ...selected.status, [lang]: e.target.value as DocsStatus } })}
                  style={{ height: 44 } as any}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, justifyContent: "flex-end" }}>
                <button className="admin-button" onClick={importFromCurrent}>
                  Import from current page
                </button>
                <button className="admin-button" onClick={deletePage}>
                  Delete
                </button>
              </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="admin-button" onClick={() => addBlock("heading")}>
                + Heading
              </button>
              <button className="admin-button" onClick={() => addBlock("paragraph")}>
                + Text
              </button>
              <button className="admin-button" onClick={() => addBlock("list")}>
                + List
              </button>
              <button className="admin-button" onClick={() => addBlock("link")}>
                + Link
              </button>
              <button className="admin-button" onClick={() => addBlock("image")}>
                + Image
              </button>
              <button className="admin-button" onClick={() => addBlock("divider")}>
                + Divider
              </button>
            </div>

            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {(selected.blocks[lang] || []).map((b, idx) => (
                <div key={b.id} style={{ border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, padding: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 700 }}>{b.type}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="admin-button" onClick={() => moveBlock(idx, -1)} style={{ height: 30 } as any}>
                        ↑
                      </button>
                      <button className="admin-button" onClick={() => moveBlock(idx, 1)} style={{ height: 30 } as any}>
                        ↓
                      </button>
                      <button className="admin-button" onClick={() => removeBlock(idx)} style={{ height: 30 } as any}>
                        ✕
                      </button>
                    </div>
                  </div>

                  {b.type === "heading" ? (
                    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 120px", gap: 10 }}>
                      <input
                        className="admin-input"
                        value={b.text}
                        onChange={(e) => {
                          const list = [...selected.blocks[lang]];
                          list[idx] = { ...b, text: e.target.value };
                          updateBlocks(list);
                        }}
                      />
                      <select
                        className="admin-input"
                        value={b.level || 2}
                        onChange={(e) => {
                          const level = Number(e.target.value);
                          const list = [...selected.blocks[lang]];
                          list[idx] = { ...b, level: level === 3 || level === 4 ? level : 2 };
                          updateBlocks(list);
                        }}
                        style={{ height: 44 } as any}
                      >
                        <option value={2}>H2</option>
                        <option value={3}>H3</option>
                        <option value={4}>H4</option>
                      </select>
                    </div>
                  ) : null}

                  {b.type === "paragraph" ? (
                    <div style={{ marginTop: 10 }}>
                      <textarea
                        value={b.text}
                        onChange={(e) => {
                          const list = [...selected.blocks[lang]];
                          list[idx] = { ...b, text: e.target.value };
                          updateBlocks(list);
                        }}
                        style={{
                          width: "100%",
                          minHeight: 110,
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(11, 16, 26, 0.62)",
                          color: "rgba(231,233,238,0.92)",
                          padding: 12,
                          boxSizing: "border-box",
                          outline: "none",
                          fontFamily: "var(--font-family)",
                          resize: "vertical",
                        }}
                      />
                    </div>
                  ) : null}

                  {b.type === "list" ? (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <label className="admin-card-subtitle" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input
                            type="checkbox"
                            checked={Boolean(b.ordered)}
                            onChange={(e) => {
                              const list = [...selected.blocks[lang]];
                              list[idx] = { ...b, ordered: e.target.checked };
                              updateBlocks(list);
                            }}
                          />
                          Ordered
                        </label>
                      </div>
                      <textarea
                        value={(b.items || []).join("\n")}
                        onChange={(e) => {
                          const items = e.target.value
                            .split("\n")
                            .map((x) => x.trim())
                            .filter(Boolean);
                          const list = [...selected.blocks[lang]];
                          list[idx] = { ...b, items };
                          updateBlocks(list);
                        }}
                        style={{
                          width: "100%",
                          minHeight: 110,
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(11, 16, 26, 0.62)",
                          color: "rgba(231,233,238,0.92)",
                          padding: 12,
                          boxSizing: "border-box",
                          outline: "none",
                          fontFamily: "var(--font-family)",
                          resize: "vertical",
                        }}
                      />
                    </div>
                  ) : null}

                  {b.type === "link" ? (
                    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <input
                        className="admin-input"
                        value={b.text}
                        onChange={(e) => {
                          const list = [...selected.blocks[lang]];
                          list[idx] = { ...b, text: e.target.value };
                          updateBlocks(list);
                        }}
                        placeholder="Link text"
                      />
                      <input
                        className="admin-input"
                        value={b.href}
                        onChange={(e) => {
                          const list = [...selected.blocks[lang]];
                          list[idx] = { ...b, href: e.target.value };
                          updateBlocks(list);
                        }}
                        placeholder="/settings/bluetooth"
                      />
                      <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <select
                          className="admin-input"
                          style={{ height: 44, maxWidth: 420 } as any}
                          value=""
                          onChange={(e) => {
                            const href = e.target.value;
                            if (!href) return;
                            const list = [...selected.blocks[lang]];
                            list[idx] = { ...b, href };
                            updateBlocks(list);
                          }}
                        >
                          <option value="">Pick internal link…</option>
                          {INTERNAL_LINKS.map((l) => (
                            <option key={l.href} value={l.href}>
                              {l.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : null}

                  {b.type === "image" ? (
                    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <input
                        className="admin-input"
                        value={b.url}
                        onChange={(e) => {
                          const list = [...selected.blocks[lang]];
                          list[idx] = { ...b, url: e.target.value };
                          updateBlocks(list);
                        }}
                        placeholder="Image URL"
                      />
                      <input
                        className="admin-input"
                        value={b.alt || ""}
                        onChange={(e) => {
                          const list = [...selected.blocks[lang]];
                          list[idx] = { ...b, alt: e.target.value };
                          updateBlocks(list);
                        }}
                        placeholder="Alt"
                      />
                      <input
                        className="admin-input"
                        value={b.caption || ""}
                        onChange={(e) => {
                          const list = [...selected.blocks[lang]];
                          list[idx] = { ...b, caption: e.target.value };
                          updateBlocks(list);
                        }}
                        placeholder="Caption"
                        style={{ gridColumn: "1 / -1" } as any}
                      />
                      <div style={{ gridColumn: "1 / -1" }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadImage(file);
                              const list = [...selected.blocks[lang]];
                              list[idx] = { ...b, url };
                              updateBlocks(list);
                            } catch (err: any) {
                              setError(err?.message || String(err));
                            } finally {
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                      </div>
                      {b.url ? (
                        <div style={{ gridColumn: "1 / -1" }}>
                          <img src={b.url} alt={b.alt || ""} style={{ width: "100%", borderRadius: 14 }} />
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div className="admin-card-subtitle">
                {selected.status[lang] === "published" ? "Published" : "Draft"} · {selected.blocks[lang].length} blocks
              </div>
              <button className="admin-button" onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Preview</div>
        <div className="admin-card-subtitle" style={{ marginTop: 6 }}>
          Same blocks rendering as site pages (without publishing)
        </div>

        <div style={{ marginTop: 14, padding: 16, borderRadius: 16, background: "#fff", color: "#222" }}>
          {selected ? (
            <div className="settings-doc-content">
              <DocsBlocks blocks={selected.blocks[lang] || []} />
            </div>
          ) : (
            <div style={{ color: "#666" }}>Select a page</div>
          )}
        </div>
      </div>
    </div>
  );
}
