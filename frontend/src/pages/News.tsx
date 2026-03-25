import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useNews } from "../context/NewsContext";

export default function News() {
  const { news } = useNews();
  const top = news.slice(0, 2);
  const rest = news.slice(2);
  const chunks: typeof rest[] = [];
  for (let i = 0; i < rest.length; i += 3) chunks.push(rest.slice(i, i + 3));

  const renderCard = (item: any, small?: boolean) => {
    const cardClass = small ? "news-card news-card--small" : "news-card";
    const wrapperClass = small ? "news-image-wrapper news-image-wrapper--small" : "news-image-wrapper";
    const imageEl = <img src={item.image} alt={item.title} className="news-image" />;
    const hasLink = typeof item.link === "string" && item.link.trim().length > 0;
    const isInternal = hasLink && item.link.startsWith("/");

    return (
      <article key={item.id} className={cardClass}>
        {hasLink ? (
          isInternal ? (
            <Link to={item.link} className={wrapperClass}>
              {imageEl}
            </Link>
          ) : (
            <a href={item.link} className={wrapperClass}>
              {imageEl}
            </a>
          )
        ) : (
          <div className={wrapperClass}>{imageEl}</div>
        )}
        <div className="news-meta">{item.date}</div>
        <h2 className="news-card-title">{item.title}</h2>
        <p className="news-card-text">{item.text}</p>
      </article>
    );
  };

  return (
    <>
      <Header variant="white" />
      <div className="page-content-white">
        <div className="news-layout">
          <h1 className="news-title">News</h1>

          {/* Large Grid (Top 2) */}
          <div className="news-grid">
            {top.map((n) => renderCard(n))}
          </div>

          {chunks.map((chunk, idx) => (
            <div key={idx} className="news-grid-small">
              {chunk.map((n) => renderCard(n, true))}
            </div>
          ))}

          <div className="news-show-more">
            <a href="#" className="news-show-more-link">Show more</a>
          </div>
        </div>
      </div>
    </>
  );
}
