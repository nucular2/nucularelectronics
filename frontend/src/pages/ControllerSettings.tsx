import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

type ControllerSection =
  | "setup"
  | "fan"
  | "examples"
  | "diagnostics"
  | "configs";

export default function ControllerSettings() {
  const [activeSection, setActiveSection] = useState<ControllerSection>("setup");
  const navigate = useNavigate();

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

              <div className="controller-content-wrap">
                <div className="controller-content">
                  {activeSection === "setup" && (
                    <>
                      <div className="controller-content-title">Controller setup</div>
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
                        <li>
                          PWM/PAS wire for connection PAS, fans for cooling or brake lights
                        </li>
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
                      <img src="/photo.png" alt="" className="controller-photo" />
                    </>
                  )}
                  {activeSection === "fan" && (
                    <>
                      <div className="controller-content-title">Fan and Light Control</div>
                    </>
                  )}
                  {activeSection === "examples" && (
                    <>
                      <div className="controller-content-title">Examples of settings</div>
                    </>
                  )}
                  {activeSection === "diagnostics" && (
                    <>
                      <div className="controller-content-title">
                        Diagnostics of controller malfunctions
                      </div>
                    </>
                  )}
                  {activeSection === "configs" && (
                    <>
                      <div className="controller-content-title">Configuration files</div>
                    </>
                  )}
                </div>
                <div className="controller-page-toc">
                  <div className="controller-page-toc-title">On this page</div>
                  <div className="controller-page-toc-item">Controller (v.0.8.13)</div>
                  <div className="controller-page-toc-item">Connecting multiple controllers</div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
