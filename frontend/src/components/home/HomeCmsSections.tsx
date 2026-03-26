import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { HomeCmsConfig } from '../../cms/homeConfig';

function renderAccentTitle(title: string, accentWords: string[]) {
  if (!accentWords || accentWords.length === 0) return title;
  const parts: Array<{ text: string; accent: boolean }> = [{ text: title, accent: false }];
  for (const raw of accentWords) {
    const w = String(raw || '').trim();
    if (!w) continue;
    const next: Array<{ text: string; accent: boolean }> = [];
    for (const p of parts) {
      if (p.accent) {
        next.push(p);
        continue;
      }
      const hay = p.text;
      const idx = hay.toLowerCase().indexOf(w.toLowerCase());
      if (idx === -1) {
        next.push(p);
        continue;
      }
      next.push({ text: hay.slice(0, idx), accent: false });
      next.push({ text: hay.slice(idx, idx + w.length), accent: true });
      next.push({ text: hay.slice(idx + w.length), accent: false });
    }
    parts.splice(0, parts.length, ...next);
  }
  return (
    <>
      {parts.map((p, i) =>
        p.accent ? (
          <span key={i} className="adv-accent">
            {p.text}
          </span>
        ) : (
          <React.Fragment key={i}>{p.text}</React.Fragment>
        )
      )}
    </>
  );
}

export default function HomeCmsSections({ config }: { config: HomeCmsConfig }) {
  const navigate = useNavigate();

  return (
    <>
      <section className="home-category-section">
        <div className="home-category-grid">
          <img
            src={config.categoryCards.leftImageUrl}
            alt={config.categoryCards.leftAlt}
            className="home-category-card"
            width={580}
            height={380}
          />
          <img
            src={config.categoryCards.rightImageUrl}
            alt={config.categoryCards.rightAlt}
            className="home-category-card"
            width={580}
            height={380}
          />
        </div>
      </section>

      <section className="advantages-section">
        <div className="advantages-title">{config.advantages.title}</div>
        <div className="advantages-subtitle">
          {config.advantages.subtitle.map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < config.advantages.subtitle.length - 1 ? <br /> : null}
            </React.Fragment>
          ))}
        </div>
        <div className="advantages-grid">
          {config.advantages.cards.map((card) => (
            <div key={card.id} className="adv-card">
              <div className="adv-number">{card.number}</div>
              <div className="adv-title">{renderAccentTitle(card.title, card.accentWords)}</div>
              <div className="adv-text">{card.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="solutions-section">
        <div className="solutions-title">{config.solutions.title}</div>
        <div className="solutions-grid">
          {config.solutions.cards.map((card) => (
            <div key={card.id} className="solution-card">
              <div className="solution-card-content">
                <div className="solution-card-actions">
                  <button type="button" className="card-button buy-button" onClick={() => navigate(card.buyHref)}>
                    Buy
                  </button>
                  <a
                    href={card.learnHref}
                    className="card-link solution-card-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(card.learnHref);
                    }}
                  >
                    Learn more
                  </a>
                </div>
              </div>
              <img src={card.imageUrl} alt={card.alt} className="solution-card-image" width={580} height={500} />
            </div>
          ))}
        </div>
      </section>

      <section className="home-bottom-plates">
        {config.bottomPlates.sections.map((s) => (
          <React.Fragment key={s.id}>
            <div className="home-bottom-title">{s.title}</div>
            <div className="home-bottom-subtitle">{s.subtitle}</div>
            <div className={`home-bottom-row ${s.layout === 'sm-lg' ? 'home-bottom-row--reverse' : ''}`}>
              <div className={`home-plate ${s.layout === 'lg-sm' ? 'home-plate--lg' : 'home-plate--sm'}`}>
                <div className="home-plate-title">{s.left.title}</div>
                <div className="home-plate-text">{s.left.text}</div>
                <div className="home-plate-actions">
                  <button type="button" className="card-button buy-button" onClick={() => navigate(s.left.buyHref)}>
                    Buy
                  </button>
                  <a
                    href={s.left.learnHref}
                    className="card-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(s.left.learnHref);
                    }}
                  >
                    Learn more
                  </a>
                </div>
              </div>
              <div className={`home-plate ${s.layout === 'lg-sm' ? 'home-plate--sm' : 'home-plate--lg'}`}>
                <div className="home-plate-title">{s.right.title}</div>
                <div className="home-plate-text">{s.right.text}</div>
                <div className="home-plate-actions">
                  <button type="button" className="card-button buy-button" onClick={() => navigate(s.right.buyHref)}>
                    Buy
                  </button>
                  <a
                    href={s.right.learnHref}
                    className="card-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(s.right.learnHref);
                    }}
                  >
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </section>
    </>
  );
}

