import React from 'react';
import type { NewsBlock } from '../../context/NewsContext';

function toVideoEmbedUrl(raw: string) {
  const url = String(raw || '').trim();
  if (!url) return '';
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
    }
    if (host === 'youtu.be') {
      const id = u.pathname.replace('/', '');
      if (id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
    }
    if (host.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id && /^[0-9]+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return url;
  }
}

export default function NewsBlocks({ blocks }: { blocks: NewsBlock[] }) {
  return (
    <>
      {blocks.map((b) => {
        if (b.type === 'heading') {
          const level = b.level || 2;
          if (level === 3) {
            return (
              <h3 key={b.id} className="news-detail-section-title">
                {b.text}
              </h3>
            );
          }
          if (level === 4) {
            return (
              <h4 key={b.id} className="news-detail-section-title">
                {b.text}
              </h4>
            );
          }
          return (
            <h2 key={b.id} className="news-detail-subtitle">
              {b.text}
            </h2>
          );
        }
        if (b.type === 'paragraph') {
          return (
            <p key={b.id} className={`news-detail-text${b.bold ? ' news-detail-text--bold' : ''}`}>
              {b.text}
            </p>
          );
        }
        if (b.type === 'list') {
          const items = Array.isArray(b.items) ? b.items : [];
          const ordered = Boolean(b.ordered);
          if (ordered) {
            return (
              <ol key={b.id} className="news-detail-list news-detail-list--ordered">
                {items.map((it, idx) => (
                  <li key={`${b.id}-${idx}`}>{it}</li>
                ))}
              </ol>
            );
          }
          return (
            <ul key={b.id} className="news-detail-list">
              {items.map((it, idx) => (
                <li key={`${b.id}-${idx}`}>{it}</li>
              ))}
            </ul>
          );
        }
        if (b.type === 'link') {
          return (
            <a key={b.id} className="news-detail-link" href={b.href} target="_blank" rel="noreferrer">
              {b.text}
            </a>
          );
        }
        if (b.type === 'image') {
          return (
            <div key={b.id} className="news-block-image">
              <div className="news-block-image-frame">
                <img src={b.url} alt={b.alt || ''} />
              </div>
              {b.caption ? <div className="news-detail-caption">{b.caption}</div> : null}
            </div>
          );
        }
        if (b.type === 'video') {
          const src = toVideoEmbedUrl(b.url);
          if (!src) return null;
          return (
            <div key={b.id} className="news-detail-video">
              <iframe
                src={src}
                title={b.title || 'Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          );
        }
        if (b.type === 'quote') {
          return (
            <blockquote key={b.id} className="news-detail-quote">
              <div>{b.text}</div>
              {b.author ? <div className="news-detail-quote-author">{b.author}</div> : null}
            </blockquote>
          );
        }
        if (b.type === 'slider') {
          const images = Array.isArray(b.images) ? b.images : [];
          if (images.length === 0) return null;
          return (
            <div key={b.id}>
              <div className="news-detail-slider">
                {images.map((img, idx) => (
                  <img key={`${b.id}-${idx}`} src={img.url} alt={img.alt || ''} />
                ))}
              </div>
              {b.caption ? <div className="news-detail-caption">{b.caption}</div> : null}
            </div>
          );
        }
        if (b.type === 'divider') {
          return <div key={b.id} className="news-detail-divider" />;
        }
        return null;
      })}
    </>
  );
}
