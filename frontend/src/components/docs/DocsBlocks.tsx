import type { NewsBlock } from "../../context/NewsContext";

function isExternalHref(href: string) {
  const h = String(href || "").trim().toLowerCase();
  return h.startsWith("http://") || h.startsWith("https://") || h.startsWith("mailto:");
}

function toVideoEmbedUrl(raw: string) {
  const url = String(raw || "").trim();
  if (!url) return "";
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
    }
    if (host === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
    }
    if (host.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id && /^[0-9]+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return url;
  }
}

export default function DocsBlocks({ blocks }: { blocks: NewsBlock[] }) {
  return (
    <>
      {blocks.map((b) => {
        if (b.type === "heading") {
          const level = b.level || 2;
          if (level === 3) return <h3 key={b.id} id={b.id}>{b.text}</h3>;
          if (level === 4) return <h4 key={b.id} id={b.id}>{b.text}</h4>;
          return <h2 key={b.id} id={b.id}>{b.text}</h2>;
        }
        if (b.type === "paragraph") {
          return <p key={b.id}>{b.text}</p>;
        }
        if (b.type === "list") {
          const items = Array.isArray(b.items) ? b.items : [];
          if (b.ordered) {
            return (
              <ol key={b.id}>
                {items.map((it, idx) => (
                  <li key={`${b.id}-${idx}`}>{it}</li>
                ))}
              </ol>
            );
          }
          return (
            <ul key={b.id}>
              {items.map((it, idx) => (
                <li key={`${b.id}-${idx}`}>{it}</li>
              ))}
            </ul>
          );
        }
        if (b.type === "link") {
          const external = isExternalHref(b.href);
          return (
            <a
              key={b.id}
              href={b.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
            >
              {b.text}
            </a>
          );
        }
        if (b.type === "image") {
          return (
            <div key={b.id}>
              <img src={b.url} alt={b.alt || ""} />
              {b.caption ? <p>{b.caption}</p> : null}
            </div>
          );
        }
        if (b.type === "video") {
          const src = toVideoEmbedUrl(b.url);
          if (!src) return null;
          return (
            <div key={b.id}>
              <iframe
                src={src}
                title={b.title || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ width: "100%", aspectRatio: "16 / 9", border: "none", borderRadius: 16 }}
              />
            </div>
          );
        }
        if (b.type === "quote") {
          return (
            <blockquote key={b.id}>
              <div>{b.text}</div>
              {b.author ? <div>{b.author}</div> : null}
            </blockquote>
          );
        }
        if (b.type === "slider") {
          const images = Array.isArray(b.images) ? b.images : [];
          if (images.length === 0) return null;
          return (
            <div key={b.id}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                {images.map((img, idx) => (
                  <img key={`${b.id}-${idx}`} src={img.url} alt={img.alt || ""} />
                ))}
              </div>
              {b.caption ? <p>{b.caption}</p> : null}
            </div>
          );
        }
        if (b.type === "divider") {
          return <hr key={b.id} style={{ border: "none", borderTop: "1px solid #e9e9e9", margin: "18px 0" }} />;
        }
        return null;
      })}
    </>
  );
}
