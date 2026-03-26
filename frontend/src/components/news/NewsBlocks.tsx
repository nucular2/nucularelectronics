import React from 'react';
import type { NewsBlock } from '../../context/NewsContext';

export default function NewsBlocks({ blocks }: { blocks: NewsBlock[] }) {
  return (
    <>
      {blocks.map((b) => {
        if (b.type === 'heading') {
          return (
            <h2 key={b.id} className="news-detail-subtitle">
              {b.text}
            </h2>
          );
        }
        if (b.type === 'paragraph') {
          return (
            <p key={b.id} className="news-detail-text">
              {b.text}
            </p>
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
        return null;
      })}
    </>
  );
}
