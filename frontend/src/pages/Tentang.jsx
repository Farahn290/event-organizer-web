import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

function Tentang() {
    const { t } = useLanguage();
    return (
        <div className="page about-page">
            <section className="about-profile">
                <div className="about-profile-copy">
                    <p className="about-profile-eyebrow">{t("aboutEyebrow")}</p>

                    <h1 className="about-profile-title">
                        <span>{t("aboutTitle1")}</span>
                        <span className="about-profile-title-accent">{t("aboutTitle2")}</span>
                        <span>{t("aboutTitle3")}</span>
                    </h1>

                    <p className="about-profile-description">
                        {t("aboutDescription")}
                    </p>

                    <p className="about-profile-description about-profile-description-secondary">
                        {t("aboutDescriptionSecondary")}
                    </p>

                    <Link to="/layanan" className="about-profile-link">
                        {t("learnAbout")} <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                </div>

                <div className="about-visual-column">
                    <div className="about-photo-grid" aria-label={t("mainServices")}>
                        <div className="about-photo-card about-photo-feature about-photo-feature--infographic">
                            <img
                                src="/about-services-highlight.png"
                                alt="Infografik layanan Maqnet Kreasindo tentang kontraktor pameran dan solusi percetakan terpadu"
                            />
                        </div>
                    </div>
                </div>

                <div className="about-photo-grid about-profile-vision">
                    <div className="about-photo-card about-photo-feature about-photo-feature--vision-mission">
                        <img
                            src="/about-vision-mission.png"
                            alt="Infografik visi, misi, dan nilai Maqnet Kreasindo"
                        />
                    </div>
                </div>

            </section>
        </div>
    );
}

export default Tentang;