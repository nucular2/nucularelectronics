import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { products } from "../data/products";

export default function Support() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const supportItems = [
      { type: "support", label: "Settings", path: "/support#settings" },
      { type: "support", label: "Firmware update", path: "/support#firmware" },
      { type: "support", label: "Connection diagrams", path: "/support#diagrams" },
      { type: "support", label: "Malfunctions", path: "/support#malfunctions" },
      { type: "support", label: "Feedback", path: "/support#feedback" },
      { type: "support", label: "For developers", path: "/support#developers" }
    ];

    const productItems = products.map((p) => ({
      type: "product" as const,
      label: p.title,
      path: `/shop?product=${p.id}`
    }));

    const all = [...supportItems, ...productItems];

    return all
      .filter((item) => item.label.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results[0]) {
      navigate(results[0].path);
    }
  };

  const handleResultClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <Header variant="white" />
      <div className="support-page">
        <div className="support-container">
          <div className="support-inner">
            <h1 className="support-title">Support</h1>
            <form className="support-search-row" onSubmit={handleSubmit}>
              <div className="support-search-input">
                <svg
                  className="support-search-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you looking for?"
                />
                {query && (
                  <button
                    type="button"
                    className="support-search-clear"
                    onClick={() => setQuery("")}
                  >
                    ×
                  </button>
                )}
              </div>
              <button className="support-search-button" type="submit">
                Search
              </button>
            </form>

            {query && (
              <div className="support-search-results">
                {results.map((item) => (
                  <button
                    key={item.type + item.label}
                    className="support-search-result-item"
                    type="button"
                    onClick={() => handleResultClick(item.path)}
                  >
                    {item.label}
                  </button>
                ))}
                {results.length === 5 && (
                  <button
                    type="button"
                    className="support-search-show-more"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
                  >
                    Show more results
                  </button>
                )}
              </div>
            )}

            <div className="support-topics">
              <div className="support-topic">
                <div className="support-topic-icon">
                  <img src="/шестиренка.png" alt="Settings" width={24} height={24} />
                </div>
                <span>Settings</span>
              </div>
              <div className="support-topic">
                <div className="support-topic-icon">
                  <img src="/update.png" alt="Firmware update" width={24} height={24} />
                </div>
                <span>Firmware update</span>
              </div>
              <div className="support-topic">
                <div className="support-topic-icon">
                  <img src="/diagrams.png" alt="Connection diagrams" width={24} height={24} />
                </div>
                <span>Connection diagrams</span>
              </div>
              <div className="support-topic">
                <div className="support-topic-icon">
                  <img src="/Malfunctions.png" alt="Malfunctions" width={24} height={24} />
                </div>
                <span>Malfunctions</span>
              </div>
              <div className="support-topic">
                <div className="support-topic-icon">
                  <img src="/feedback.png" alt="Feedback" width={24} height={24} />
                </div>
                <span>Feedback</span>
              </div>
              <div className="support-topic">
                <div className="support-topic-icon">
                  <img src="/github.png" alt="For developers" width={24} height={24} />
                </div>
                <span>For developers</span>
              </div>
            </div>

            <div className="support-help-banner">
              <div className="support-help-content">
                <div className="support-help-title">I need help!</div>
                <div className="support-help-text">
                  If you have questions, suggestions or you need technical support, use one of the
                  following methods to contact us.
                </div>
                <div className="support-help-actions">
                  <button className="support-help-button">Write to us</button>
                  <div className="support-help-icons">
                    <img src="/social.png" alt="Email" />
                    <img src="/тг.png" alt="Telegram" />
                    <img src="/ватсап.png" alt="WhatsApp" />
                    <img src="/макс.png" alt="Messenger" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
