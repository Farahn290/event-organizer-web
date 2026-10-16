import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

function Footer() {
    const { t } = useLanguage();

    return (

        <footer className="footer">

            <div className="footer-main">

                <div className="footer-brand">

                    <div className="footer-brand-logos">
                        <Link to="/" className="footer-logo">
                            <img
                                src="/maqnet-kreasindo-logo.png"
                                alt="Maqnet Kreasindo"
                                className="footer-logo-image"
                            />
                        </Link>
                        <img
                            src="/indonesia-map-logo.png"
                            alt="Peta Indonesia"
                            className="footer-map-logo"
                        />
                    </div>

                    <p>
                        {t("footerDescription")}
                    </p>

                    <div className="footer-social-icons" aria-label="Media sosial">
                        <a href="https://instagram.com/maqnetkreasindo?xtok=MTJ5dWVnNWlyM25yZw%3D%3D" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                                <circle cx="12" cy="12" r="4" />
                                <circle className="footer-social-icon-fill" cx="17.6" cy="6.8" r="1" />
                            </svg>
                        </a>
                        <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M21 7.2a2.8 2.8 0 0 0-2-2C17.2 4.7 12 4.7 12 4.7s-5.2 0-7 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2.5 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7 .5 7 .5s5.2 0 7-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-4.8 29 29 0 0 0-.5-4.8Z" />
                                <path className="footer-social-icon-dark" d="m10 15.5 5-3.5-5-3.5v7Z" />
                            </svg>
                        </a>
                        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="12" r="9.5" />
                                <path className="footer-social-icon-dark" d="M13.5 20.9v-7.6h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.5-1.5h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6v7.6h3.1Z" />
                            </svg>
                        </a>
                        <a href="https://www.threads.net/" target="_blank" rel="noreferrer" aria-label="Threads">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M18.5 10.2c-.3-4.1-2.6-6.4-6.5-6.4-4.1 0-6.7 2.8-6.7 8.1 0 5.1 2.4 8.2 6.8 8.2 3.3 0 5.8-1.8 5.8-4.7 0-2.3-1.5-3.8-4.2-4.1-2.4-.3-3.6.6-3.6 2.1 0 1.2.9 2 2.2 2 1.8 0 3.1-1.7 3.1-4.1 0-2.8-1.6-4.4-4.1-4.4" />
                                <path d="M14.6 11c2.7.7 4.1 2.1 4.1 4.4" />
                            </svg>
                        </a>
                        <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M14 3v11.1a4 4 0 1 1-3-3.9V7.1a7 7 0 1 0 6.2 7V9.8a8.4 8.4 0 0 0 4.3 1.2V7.7A4.8 4.8 0 0 1 17 6.3 4.8 4.8 0 0 1 15.7 3H14Z" />
                            </svg>
                        </a>
                    </div>

                </div>


                <div className="footer-column">

                    <h3>
                        {t("navigation")}
                    </h3>

                    <Link to="/">
                        {t("home")}
                    </Link>

                    <Link to="/tentang">
                        {t("about")}
                    </Link>

                    <Link to="/layanan">
                        {t("services")}
                    </Link>

                    <Link to="/event">
                        {t("events")}
                    </Link>

                </div>


                <div className="footer-column">

                    <h3>
                        {t("explore")}
                    </h3>

                    <Link to="/galeri">
                        {t("gallery")}
                    </Link>

                    <Link to="/kontak">
                        {t("contact")}
                    </Link>

                    <Link to="/login">
                        {t("admin")}
                    </Link>

                </div>


                <div className="footer-column">

                    <h3>
                        {t("contact")}
                    </h3>

                    <a
                        className="footer-contact-link"
                        href="https://www.google.com/maps/search/?api=1&query=Jakarta%2C%20Indonesia"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <MapPin size={15} aria-hidden="true" />
                        <span>{t("jakarta")}</span>
                    </a>

                    <a className="footer-contact-link" href="mailto:hello@eventora.com">
                        <Mail size={15} aria-hidden="true" />
                        <span>hello@eventora.com</span>
                    </a>

                    <a className="footer-contact-link" href="https://wa.me/6281234567890">
                        <Phone size={15} aria-hidden="true" />
                        <span>+62 812-3456-7890</span>
                    </a>

                </div>

            </div>


            <div className="footer-bottom">

                <p>
                    © 2026 Maqnet Kreasindo. {t("copyright")}
                </p>

                <p>
                    {t("eventOrganizer")}
                </p>

            </div>

        </footer>
    );
}

export default Footer;