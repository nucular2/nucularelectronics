import Header from "../components/Header";
import { Link, useParams } from "react-router-dom";
import { useNews } from "../context/NewsContext";
import NewsBlocks from "../components/news/NewsBlocks";

function isNumeric(value: string) {
  return /^[0-9]+$/.test(value);
}

export default function NewsDetailDynamic() {
  const { slug } = useParams();
  const { news } = useNews();
  const s = String(slug || "");

  const byLink = news.find((n) => n.link === `/news/${s}`);
  const byId = isNumeric(s) ? news.find((n) => n.id === Number(s)) : undefined;
  const item = byLink || byId;

  if (!item) {
    return (
      <>
        <Header variant="white" />
        <div className="page-content-white">
          <div className="news-detail-shell">
            <div className="news-detail-breadcrumb">
              <Link to="/news" className="news-detail-back">
                <span>Back to news</span>
              </Link>
            </div>
            <div className="news-detail">
              <h1 className="news-detail-title">News not found</h1>
            </div>
          </div>
        </div>
      </>
    );
  }

  const blocks = Array.isArray(item.blocks) && item.blocks.length > 0 ? item.blocks : [{ id: "p1", type: "paragraph" as const, text: item.text }];

  return (
    <>
      <Header variant="white" />
      <div className="page-content-white">
        <div className="news-detail-shell">
          <div className="news-detail-breadcrumb">
            <Link to="/news" className="news-detail-back">
              <span>Back to news</span>
            </Link>
          </div>

          <div className="news-detail">
            <h1 className="news-detail-title">{item.title}</h1>
            <div className="news-detail-date">{item.date}</div>

            {item.image ? (
              <div className="news-detail-image">
                <img src={item.image} alt={item.title} />
              </div>
            ) : null}

            <NewsBlocks blocks={blocks} />
          </div>
        </div>
      </div>
    </>
  );
}
