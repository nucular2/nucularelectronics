import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import DocsLanguageToggle, { useDocsLanguage } from "../components/DocsLanguageToggle";
import "./ControllerSettings.css";

export default function OnboardComputerSettings() {
  const navigate = useNavigate();
  const { language } = useDocsLanguage();

  return (
    <>
      <Header variant="white" />
      <div className="support-page">
        <div className="support-container">
          <div className="support-breadcrumb">
            <button type="button" className="support-breadcrumb-link" onClick={() => navigate("/support")}>
              Support
            </button>
            <span className="support-breadcrumb-separator">/</span>
            <button type="button" className="support-breadcrumb-link" onClick={() => navigate("/settings")}>
              Settings
            </button>
            <span className="support-breadcrumb-separator">/</span>
            <span className="support-breadcrumb-current">
              {language === "ru" ? "Бортовой компьютер" : "Onboard computer"}
            </span>
            <DocsLanguageToggle />
          </div>

          <div className="controller-layout">
            <div className="controller-list">
              <button type="button" className="controller-list-item controller-list-item-active">
                {language === "ru" ? "Схема подключения дисплея" : "Display wiring diagram"}
              </button>
            </div>

            <div className="controller-content-wrap">
              <div className="controller-content">
                <div className="controller-content-title">{language === "ru" ? "Бортовой компьютер" : "Onboard computer"}</div>
                <div className="controller-content-text">
                  {language === "ru" ? "Схема подключения дисплея:" : "Display wiring diagram:"}
                </div>
                <img
                  src="/docs/settings-pages/onboard-computer/images/diagram.png"
                  alt="Display wiring diagram"
                  className="controller-photo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
