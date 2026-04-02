import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { products } from "../data/products";
import "./ControllerSettings.css";

export default function Settings() {
  const [query, setQuery] = useState("");
  const [searchPhase, setSearchPhase] = useState<"idle" | "loading" | "done">("idle");
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const navigate = useNavigate();
  const cards = useMemo(
    () => [
      {
        key: "bluetooth",
        title: "Bluetooth",
        text: "How to connect the Bluetooth module to the controller and display.",
        onClick: () => navigate("/settings/bluetooth")
      },
      {
        key: "cadmodels",
        title: "CAD files / 3D models",
        text: "STEP/STL models for printing and mounts.",
        onClick: () => navigate("/settings/cad-models")
      },
      {
        key: "controller",
        title: "Controller",
        text: "Settings and connection diagrams for 6F, 12F, and 24F controllers.",
        onClick: () => navigate("/settings/controller#setup")
      },
      {
        key: "configs",
        title: "Configuration files",
        text: "Ready-made configurations for different motors and vehicles.",
        onClick: () => navigate("/settings/controller#configs")
      },
      {
        key: "diagnostics",
        title: "Diagnostics",
        text: "Diagnostics of controller malfunctions and troubleshooting.",
        onClick: () => navigate("/settings/controller#diagnostics")
      },
      {
        key: "examples",
        title: "Examples of settings",
        text: "Examples and explanations of settings for various functions.",
        onClick: () => navigate("/settings/controller#examples")
      },
      {
        key: "fan",
        title: "Fan and light control",
        text: "Stoplight and fan wiring and setup (PWM outputs).",
        onClick: () => navigate("/settings/controller#fan")
      },
      {
        key: "schematic",
        title: "Connection schematic",
        text: "Connection schematic PDFs and pinouts.",
        onClick: () => navigate("/settings/connection-schematic")
      },
      {
        key: "setup",
        title: "Controller setup",
        text: "Full controller setup and parameters reference.",
        onClick: () => navigate("/settings/controller#setup")
      },
      {
        key: "onboard",
        title: "On-board computer",
        text: "On-board computer settings and connection guide.",
        onClick: () => navigate("/settings/onboard-computer")
      },
      {
        key: "firmware",
        title: "Firmware",
        text: "Firmware files and update instructions.",
        onClick: () => navigate("/settings/firmware")
      },
      {
        key: "motors",
        title: "Motor information",
        text: "Pole pairs and measured motor parameters.",
        onClick: () => navigate("/settings/motor-information")
      },
      {
        key: "ulight",
        title: "uLight",
        text: "uLight settings and connection diagram.",
        onClick: () => navigate("/settings/ulight")
      },
      {
        key: "usb2can",
        title: "USB2CAN module",
        text: "USB2CAN module information and usage.",
        onClick: () => navigate("/settings/usb2can")
      }
    ],
    [navigate]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const supportItems = [
      { type: "support", label: "Settings", path: "/settings" },
      { type: "support", label: "Firmware update", path: "/support#firmware" },
      { type: "support", label: "Connection diagrams", path: "/support#diagrams" },
      { type: "support", label: "Malfunctions", path: "/support#malfunctions" },
      { type: "support", label: "Feedback", path: "/support#feedback" },
      { type: "support", label: "For developers", path: "/support#developers" },
      { type: "settings", label: "Bluetooth", path: "/settings/bluetooth" },
      { type: "settings", label: "CAD files / 3D models", path: "/settings/cad-models" },
      { type: "settings", label: "Controller setup", path: "/settings/controller#setup" },
      { type: "settings", label: "Fan and light control", path: "/settings/controller#fan" },
      { type: "settings", label: "Examples of settings", path: "/settings/controller#examples" },
      { type: "settings", label: "Diagnostics", path: "/settings/controller#diagnostics" },
      { type: "settings", label: "Configuration files", path: "/settings/controller#configs" },
      { type: "settings", label: "On-board computer", path: "/settings/onboard-computer" },
      { type: "settings", label: "uLight", path: "/settings/ulight" },
      { type: "settings", label: "Firmware", path: "/settings/firmware" },
      { type: "settings", label: "Motor information", path: "/settings/motor-information" },
      { type: "settings", label: "USB2CAN module", path: "/settings/usb2can" },
      { type: "settings", label: "Connection schematic", path: "/settings/connection-schematic" }
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
    if (!query.trim()) return;
    setSearchPhase("loading");
    window.setTimeout(() => {
      setSearchPhase("done");
    }, 350);
  };

  const handleResultClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <Header variant="white" />
      <div className="support-page">
        <div className="support-container">
          <div className="support-breadcrumb">
            <button
              type="button"
              className="support-breadcrumb-link"
              onClick={() => navigate("/support")}
            >
              Support
            </button>
            <span className="support-breadcrumb-separator">/</span>
            <span className="support-breadcrumb-current">Settings</span>
          </div>
          <div className="support-inner">
            <h1 className="support-title">Settings</h1>
            <form className="support-search-row" onSubmit={handleSubmit}>
              <div className="support-search-stack">
              <div className={`support-search-input ${query.trim() ? "support-search-input--filled" : ""}`}>
                <svg
                  className="support-search-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
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
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (searchPhase !== "idle") setSearchPhase("idle");
                  }}
                  placeholder="What are you looking for?"
                />
                {query && (
                  <button
                    type="button"
                    className="support-search-clear"
                    onClick={() => {
                      setQuery("");
                      setSearchPhase("idle");
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              {query.trim() ? (
                <div className="support-search-results">
                  {results.length > 0 ? (
                    <>
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
                      {results.length === 5 ? (
                        <button
                          type="button"
                          className="support-search-show-more"
                          onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
                        >
                          Show more results
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <div className="support-search-not-found">Not found</div>
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
                Search
              </button>
            </form>

            <div className="settings-grid">
              {cards.map((card) => (
                <div
                  key={card.key}
                  className={`settings-card${activeCard === card.key ? " settings-card-active" : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setActiveCard(card.key);
                    card.onClick();
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    e.preventDefault();
                    setActiveCard(card.key);
                    card.onClick();
                  }}
                >
                  <div className="settings-card-title">{card.title}</div>
                  <div className="settings-card-text">{card.text}</div>
                </div>
              ))}
            </div>

            <div className="support-help-banner support-help-banner--narrow">
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
