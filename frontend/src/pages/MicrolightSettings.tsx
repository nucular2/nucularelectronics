import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import DocsLanguageToggle, { useDocsLanguage } from "../components/DocsLanguageToggle";
import "./ControllerSettings.css";

export default function MicrolightSettings() {
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
            <span className="support-breadcrumb-current">{language === "ru" ? "Микролайт" : "Microlight"}</span>
            <DocsLanguageToggle />
          </div>

          <div className="controller-layout">
            <div className="controller-list">
              <button type="button" className="controller-list-item controller-list-item-active">
                {language === "ru" ? "Схема подключения uLight" : "uLight wiring diagram"}
              </button>
            </div>

            <div className="controller-content-wrap">
              <div className="controller-content">
                <div className="controller-content-title">{language === "ru" ? "Микролайт" : "Microlight"}</div>
                <div className="controller-content-text">
                  {language === "ru" ? "Схема подключения uLight:" : "uLight wiring diagram:"}
                </div>
                <img
                  src={
                    language === "ru"
                      ? "/docs/settings-pages/ulight/ru/images/ulight_ru_0109_2.png"
                      : "/docs/settings-pages/ulight/en/images/ulight_en_0109_2.png"
                  }
                  alt="uLight wiring diagram"
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
