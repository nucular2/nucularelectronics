import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import "./ControllerSettings.css";

type ControllerSection =
  | "setup"
  | "fan"
  | "examples"
  | "diagnostics"
  | "configs";

export default function ControllerSettings() {
  const initialIsMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 899.98px)").matches;
  const [activeSection, setActiveSection] = useState<ControllerSection | null>(
    initialIsMobile ? null : "setup"
  );
  const [query, setQuery] = useState("");
  const [searchPhase, setSearchPhase] = useState<"idle" | "loading" | "done">("idle");
  const navigate = useNavigate();
  const location = useLocation();
  const setupImageRef = useRef<HTMLImageElement | null>(null);
  const diagnosticsTitleRef = useRef<HTMLDivElement | null>(null);
  const setupTitleRef = useRef<HTMLDivElement | null>(null);
  const fanTitleRef = useRef<HTMLDivElement | null>(null);
  const examplesTitleRef = useRef<HTMLDivElement | null>(null);
  const configsTitleRef = useRef<HTMLDivElement | null>(null);
  const fanIntroRef = useRef<HTMLDivElement | null>(null);
  const fanSmallLoadRef = useRef<HTMLDivElement | null>(null);
  const fanIsolatedRef = useRef<HTMLDivElement | null>(null);
  const fanFanRef = useRef<HTMLDivElement | null>(null);

  const handleGoToSetupImage = () => {
    setActiveSection("setup");
    setTimeout(() => {
      if (setupImageRef.current) {
        setupImageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  useEffect(() => {
    const hash = location.hash;
    const go = (section: ControllerSection, ref?: React.RefObject<HTMLElement | null>) => {
      setActiveSection(section);
      setTimeout(() => {
        (ref?.current ?? document.body).scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    };

    if (hash === "#problems_and_diagnostics" || hash === "#diagnostics") return go("diagnostics", diagnosticsTitleRef);
    if (hash === "#fan") return go("fan", fanTitleRef);
    if (hash === "#examples") return go("examples", examplesTitleRef);
    if (hash === "#configs") return go("configs", configsTitleRef);
    if (hash === "#setup") return go("setup", setupTitleRef);
  }, [location.hash]);

  const fanDocItems = useMemo(
    () => [
      {
        id: "fan_intro",
        label: "Fan and light connection",
        section: "fan" as const,
        ref: fanIntroRef,
        text:
          "It is possible to connect stoplight or fan to controller port P1/P2. Please note that controller outputs are open-drain 5V max, 220R resistor on the line. Don't use controller logic ground for loads more than 0.5A, use power ground instead. System (CAN) cable uses power ground.",
      },
      {
        id: "fan_small_load",
        label: "Small load (simplified scheme)",
        section: "fan" as const,
        ref: fanSmallLoadRef,
        text:
          "You can connect small power light directly to controller with this scheme, 1kHz operation is enough.",
      },
      {
        id: "fan_isolated",
        label: "Power load (isolated scheme)",
        section: "fan" as const,
        ref: fanIsolatedRef,
        text:
          "If you are using something more powerful, isolated scheme recommended, you can also buy this kind of boards on aliexpress (Mosfet Optocoupler Isolation Driver). In some cases for isolated driver you need to invert min and max.",
      },
      {
        id: "fan_fan",
        label: "4-wire fan scheme",
        section: "fan" as const,
        ref: fanFanRef,
        text:
          "Fan control requires 4-wire fan. 20kHz is default, but you can try any lower.",
      },
    ],
    []
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return fanDocItems
      .filter((item) => (item.label + " " + item.text).toLowerCase().includes(q))
      .slice(0, 5);
  }, [fanDocItems, query]);

  const scrollTo = (target: React.RefObject<HTMLElement | null>, section: ControllerSection) => {
    setActiveSection(section);
    setTimeout(() => {
      const el = target.current;
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchPhase("loading");
    window.setTimeout(() => {
      setSearchPhase("done");
    }, 250);
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
            <button
              type="button"
              className="support-breadcrumb-link"
              onClick={() => navigate("/settings")}
            >
              Settings
            </button>
            <span className="support-breadcrumb-separator">/</span>
            <span className="support-breadcrumb-current">Controller</span>
          </div>

          <form className="support-search-row" onSubmit={handleSubmit}>
            <div className="support-search-stack">
              <div className={`support-search-input ${query.trim() ? "support-search-input--filled" : ""}`}>
                <svg className="support-search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.16667 3.33333C5.94501 3.33333 3.33333 5.94501 3.33333 9.16667C3.33333 12.3883 5.94501 15 9.16667 15C12.3883 15 15 12.3883 15 9.16667C15 5.94501 12.3883 3.33333 9.16667 3.33333ZM1.66667 9.16667C1.66667 5.02454 5.02454 1.66667 9.16667 1.66667C13.3088 1.66667 16.6667 5.02454 16.6667 9.16667C16.6667 10.9569 16.0403 12.6018 14.992 13.89L18.0892 16.9872C18.4146 17.3126 18.4146 17.8403 18.0892 18.1657C17.7638 18.4911 17.2362 18.4911 16.9108 18.1657L13.8136 15.0685C12.5253 16.1168 10.8804 16.7432 9.09012 16.7432C4.94799 16.7432 1.59012 13.3853 1.59012 9.2432L1.66667 9.16667Z"
                    fill="currentColor"
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
                {query.trim() ? (
                  <button
                    type="button"
                    className="support-search-clear"
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery("");
                      setSearchPhase("idle");
                    }}
                  >
                    ×
                  </button>
                ) : null}
              </div>
              {query.trim() ? (
                <div className="support-search-results">
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map((item) => (
                        <button
                          key={item.id}
                          className="support-search-result-item"
                          type="button"
                          onClick={() => {
                            setQuery("");
                            setSearchPhase("idle");
                            scrollTo(item.ref as any, item.section);
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
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

          <div className="controller-layout">
            <div className="controller-list">
                <button
                  type="button"
                  className={
                    activeSection === "setup"
                      ? "controller-list-item controller-list-item-active"
                      : "controller-list-item"
                  }
                  onClick={() => setActiveSection("setup")}
                >
                  Controller setup
                </button>
                <button
                  type="button"
                  className={
                    activeSection === "fan"
                      ? "controller-list-item controller-list-item-active"
                      : "controller-list-item"
                  }
                  onClick={() => setActiveSection("fan")}
                >
                  Fan and Light Control
                </button>
                <button
                  type="button"
                  className={
                    activeSection === "examples"
                      ? "controller-list-item controller-list-item-active"
                      : "controller-list-item"
                  }
                  onClick={() => setActiveSection("examples")}
                >
                  Examples of settings
                </button>
                <button
                  type="button"
                  className={
                    activeSection === "diagnostics"
                      ? "controller-list-item controller-list-item-active"
                      : "controller-list-item"
                  }
                  onClick={() => setActiveSection("diagnostics")}
                >
                  Diagnostics of controller malfunctions
                </button>
                <button
                  type="button"
                  className={
                    activeSection === "configs"
                      ? "controller-list-item controller-list-item-active"
                      : "controller-list-item"
                  }
                  onClick={() => setActiveSection("configs")}
                >
                  Configuration files
                </button>
              </div>

              {activeSection !== null && (
                <>
                  <div className="controller-content-wrap">
                    <div className="controller-content">
                      {activeSection === "setup" && (
                        <>
                          <div ref={setupTitleRef} className="controller-content-title">
                            Controller setup
                          </div>
                          <div className="controller-content-subtitle">Controller (v.0.8.13)</div>
                          <div className="controller-content-text">
                            The controller allows you to control BLDC (Brushless Direct Current Motor) and PMSM
                            (Permanent Magnet Synchronous Motor) electric motors. At the moment we are producing
                            three types of controllers for different motors power.
                          </div>
                          <div className="controller-section-title">In the kit:</div>
                          <ul className="controller-section-list">
                            <li>CAN-cable 1,2-meters length for connection to the On-board Computer</li>
                            <li>Phase wires</li>
                            <li>Battery wires</li>
                            <li>Hall sensors wire</li>
                          </ul>
                          <div className="controller-content-text">
                            Phase, battery, and Hall sensors wires are supplied with connectors, depending on
                            the type and specification of the controller in the order.
                          </div>
                          <div className="controller-section-title">Optionally you can order:</div>
                          <ul className="controller-section-list">
                            <li>CAN-cables 0,3 and 2 meters length</li>
                            <li>
                              Controller-side inputs for connection throttle, brakes levers directly to the
                              Controller
                            </li>
                            <li>PWM/PAS wire for connection PAS, fans for cooling or brake lights</li>
                          </ul>
                          <div className="controller-section-subtitle">Connecting multiple controllers</div>
                          <div className="controller-content-text">
                            If you want to connect two or more Controllers, you can use a CAN splitter with
                            four ports (purchased separately) or a lighting controller uLight, which also has
                            three own CAN ports. The On-board computer supports the connection of up to eight
                            Controllers.
                          </div>
                          <div className="controller-content-text">
                            For example, for a two-motor connection scheme, which is used on all-wheel-drive
                            electric scooters, in addition to the second controller, you will need a
                            CAN-splitter and one more CAN wire (there are 2, 1.2, and 0.3 meters long). Each
                            Controller has a standard CAN-wire 1.2 m long. These wires from both controllers
                            must be connected to a CAN-splitter, and from it one CAN-wire connects directly to
                            the On-board computer. In the On-board computer, you can configure both controllers
                            are separate.
                          </div>
                          <div className="controller-warning">
                            <div className="controller-warning-icon">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_1011_7626)">
                                  <path
                                    d="M8 6.25C8.41421 6.25 8.75 6.58579 8.75 7V12C8.75 12.4142 8.41421 12.75 8 12.75C7.58579 12.75 7.25 12.4142 7.25 12V7C7.25 6.58579 7.58579 6.25 8 6.25Z"
                                    fill="#222222"
                                  />
                                  <path
                                    d="M8 5C8.55229 5 9 4.55228 9 4C9 3.44772 8.55229 3 8 3C7.44772 3 7 3.44772 7 4C7 4.55228 7.44772 5 8 5Z"
                                    fill="#222222"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5Z"
                                    fill="#222222"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_1011_7626">
                                    <rect width="16" height="16" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <div className="controller-warning-text">
                              Pay attention to the connection diagram. Do not disconnect power grounds when
                              system wires are connected! First connect all power wires and only then CAN wires.
                              When disconnecting the controllers, first disconnect all CAN wires and only then
                              disconnect the power cables; it is also recommended to discharge the controller
                              capacitors with a resistor or an ordinary light bulb.
                            </div>
                          </div>
                          <img src="/photo.png" alt="" className="controller-photo" ref={setupImageRef} />
                        </>
                      )}
                      {activeSection === "fan" && (
                        <>
                          <div ref={fanTitleRef} className="controller-content-title">
                            Fan and Light Control
                          </div>
                          <div ref={fanIntroRef} id="fan_intro" className="controller-content-text">
                            It is possible to connect stoplight or fan to controller port P1/P2. Configuration
                            described in{" "}
                            <span className="controller-content-link" onClick={handleGoToSetupImage}>
                              Controller setup
                            </span>
                            .
                          </div>
                          <div className="controller-content-text">
                            Please note that controller outputs are open-drain 5V max, 220R resistor on the line.
                            Don&apos;t use controller logic ground for loads more than 0.5A, use power ground
                            instead. System (CAN) cable uses power ground.
                          </div>

                          <div ref={fanSmallLoadRef} id="fan_small_load" className="controller-section-subtitle">
                            Small load (simplified scheme)
                          </div>
                          <div className="controller-content-text">
                            You can connect small power light directly to controller with this scheme, 1kHz
                            operation is enough:
                          </div>
                          <img
                            src="/docs/controller/light-fan-pwm/mosfet-lamp.png"
                            alt="Small load wiring scheme"
                            className="controller-photo"
                          />

                          <div ref={fanIsolatedRef} id="fan_isolated" className="controller-section-subtitle">
                            Power load (isolated scheme)
                          </div>
                          <div className="controller-content-text">
                            If you are using something more powerful, isolated scheme recommended, you can also
                            buy this kind of boards on aliexpress (Mosfet Optocoupler Isolation Driver):
                          </div>
                          <img
                            src="/docs/controller/light-fan-pwm/opto-mosfet.png"
                            alt="Isolated wiring scheme"
                            className="controller-photo"
                          />
                          <div className="controller-content-text">
                            In some cases for isolated driver you need to invert min and max.
                          </div>

                          <div ref={fanFanRef} id="fan_fan" className="controller-section-subtitle">
                            Fan control (4-wire fan)
                          </div>
                          <div className="controller-content-text">
                            Fan control requires 4-wire fan. 20kHz is default, but you can try any lower. 4-wire
                            fan scheme:
                          </div>
                          <img
                            src="/docs/controller/light-fan-pwm/fan.png"
                            alt="Fan wiring scheme"
                            className="controller-photo"
                          />
                        </>
                      )}
                      {activeSection === "examples" && (
                        <>
                          <div ref={examplesTitleRef} className="controller-content-title">
                            Examples of settings
                          </div>
                        </>
                      )}
                      {activeSection === "diagnostics" && (
                        <>
                          <div
                            id="problems_and_diagnostics"
                            ref={diagnosticsTitleRef}
                            className="controller-content-title"
                          >
                            Diagnostics of controller malfunctions
                          </div>
                        </>
                      )}
                      {activeSection === "configs" && (
                        <>
                          <div ref={configsTitleRef} className="controller-content-title">
                            Configuration files
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {activeSection === "setup" && (
                    <div className="controller-page-toc">
                      <div className="controller-page-toc-title">On this page</div>
                      <div className="controller-page-toc-item">Controller (v.0.8.13)</div>
                      <div className="controller-page-toc-item">Connecting multiple controllers</div>
                    </div>
                  )}
                  {activeSection === "fan" && (
                    <div className="controller-page-toc">
                      <div className="controller-page-toc-title">On this page</div>
                      <div className="controller-page-toc-item" onClick={() => scrollTo(fanIntroRef as any, "fan")}>
                        Fan and light connection
                      </div>
                      <div className="controller-page-toc-item" onClick={() => scrollTo(fanSmallLoadRef as any, "fan")}>
                        Small load
                      </div>
                      <div className="controller-page-toc-item" onClick={() => scrollTo(fanIsolatedRef as any, "fan")}>
                        Power load
                      </div>
                      <div className="controller-page-toc-item" onClick={() => scrollTo(fanFanRef as any, "fan")}>
                        Fan
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
        </div>
      </div>
    </>
  );
}
