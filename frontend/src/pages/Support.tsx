import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { products } from "../data/products";
import "./ControllerSettings.css";

export default function Support() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const supportItems = [
      { type: "support", label: "Settings", path: "/settings" },
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
              <button className="support-search-button" type="submit">Search</button>
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
              <div
                className="support-topic support-topic-link"
                onClick={() => navigate("/settings")}
              >
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
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Email">
                      <g clipPath="url(#clip0_2080_26453)">
                        <rect width="44" height="44" rx="22" fill="white" />
                        <path d="M23.5714 25.2138C23.1315 25.4912 22.5441 25.6299 21.809 25.6299C21.0566 25.6299 20.4575 25.4544 20.0118 25.1034C19.572 24.7468 19.2536 24.2855 19.0568 23.7194C18.8658 23.1477 18.7703 22.5392 18.7703 21.8939C18.7703 21.2486 18.889 20.674 19.1263 20.1702C19.3694 19.6607 19.7167 19.2617 20.1681 18.973C20.6254 18.6843 21.1781 18.5399 21.8264 18.5399C22.5441 18.5399 23.12 18.6588 23.5541 18.8966C23.9882 19.1343 24.3036 19.4994 24.5004 19.9919C24.6972 20.4844 24.7956 21.1155 24.7956 21.8854C24.8014 22.7118 24.7088 23.4024 24.5178 23.9572C24.3268 24.5119 24.0113 24.9308 23.5714 25.2138Z" fill="#474747" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M22 44C34.1503 44 44 34.1503 44 22C44 9.84974 34.1503 0 22 0C9.84974 0 0 9.84974 0 22C0 34.1503 9.84974 44 22 44ZM17.5549 32.2698C18.9729 32.7566 20.5935 33 22.4167 33C23.1634 33 23.9013 32.9462 24.6306 32.8387C25.3657 32.7311 26.0371 32.5924 26.6448 32.4226C27.2584 32.2528 27.7445 32.0773 28.1034 31.8962L27.3654 29.7395C27.0934 29.8414 26.7056 29.9602 26.2021 30.0961C25.6985 30.232 25.1313 30.3508 24.5004 30.4527C23.8695 30.5546 23.2242 30.6056 22.5643 30.6056C21.1289 30.6056 19.8585 30.4188 18.753 30.0452C17.6532 29.6716 16.7301 29.1225 15.9834 28.3979C15.2368 27.6734 14.6696 26.7818 14.2818 25.7233C13.8998 24.6591 13.7088 23.4392 13.7088 22.0637C13.7088 20.7787 13.8911 19.607 14.2557 18.5484C14.6262 17.4842 15.1731 16.5644 15.8966 15.7889C16.6259 15.0134 17.5288 14.4162 18.6054 13.9973C19.6819 13.5728 20.9292 13.3605 22.3473 13.3605C23.2733 13.3605 24.1444 13.4624 24.9605 13.6662C25.7766 13.8699 26.5175 14.1728 27.1831 14.5747C27.8545 14.9709 28.4304 15.4662 28.9108 16.0606C29.3912 16.655 29.7616 17.3456 30.0221 18.1324C30.2883 18.9135 30.4186 19.7853 30.4128 20.7476C30.4186 21.9193 30.3549 22.8816 30.2218 23.6345C30.0944 24.3817 29.8861 24.9364 29.5967 25.2987C29.3131 25.6553 28.9398 25.8337 28.4767 25.8337C28.1063 25.8337 27.8169 25.7035 27.6085 25.4431C27.4059 25.1827 27.3018 24.8402 27.296 24.4157V16.3323H24.8737V17.2833H24.7522C24.6596 17.0342 24.428 16.805 24.0576 16.5955C23.693 16.3861 23.2357 16.2304 22.6859 16.1285C22.136 16.0266 21.5485 16.0181 20.9234 16.103C20.3215 16.1823 19.7369 16.3634 19.1697 16.6465C18.6025 16.9238 18.0931 17.3088 17.6417 17.8012C17.196 18.2937 16.84 18.8881 16.5738 19.5843C16.3075 20.2806 16.1744 21.0844 16.1744 21.9958C16.1744 22.9298 16.296 23.7647 16.5391 24.5006C16.7822 25.2365 17.1237 25.8648 17.5635 26.3856C18.0092 26.9007 18.5301 27.3026 19.1263 27.5913C19.7282 27.8743 20.3823 28.0328 21.0884 28.0668C21.7482 28.0951 22.3473 28.0328 22.8856 27.88C23.4238 27.7215 23.8753 27.5035 24.2399 27.2262C24.6104 26.9431 24.8621 26.6318 24.9953 26.2922H25.0994C25.1689 26.7167 25.3368 27.0762 25.603 27.3705C25.875 27.6592 26.231 27.8715 26.6709 28.0073C27.1108 28.1432 27.623 28.197 28.2076 28.1687C29.1394 28.1347 29.915 27.9224 30.5343 27.5318C31.1536 27.1356 31.6427 26.6035 32.0016 25.9355C32.3662 25.2676 32.6238 24.5034 32.7743 23.643C32.9248 22.7769 33 21.8599 33 20.8919C33 19.4938 32.7656 18.1975 32.2968 17.0031C31.8337 15.803 31.1479 14.7558 30.2391 13.8614C29.3362 12.9614 28.2278 12.2595 26.914 11.7557C25.6059 11.2519 24.1039 11 22.408 11C20.608 11 19.0018 11.2604 17.5896 11.7812C16.1773 12.3019 14.9821 13.0491 14.0039 14.0228C13.0258 14.9907 12.282 16.1568 11.7727 17.521C11.2634 18.8796 11.0058 20.4051 11 22.0976C11.0058 23.8298 11.2605 25.3695 11.764 26.7167C12.2676 28.0639 13.0055 29.2046 13.9779 30.1386C14.9503 31.0782 16.1426 31.7886 17.5549 32.2698Z" fill="#474747" />
                      </g>
                      <defs>
                        <clipPath id="clip0_2080_26453">
                          <rect width="44" height="44" rx="22" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
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
