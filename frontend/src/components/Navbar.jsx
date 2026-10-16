import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);
    const { language, setLanguage, t } = useLanguage();

    return (
        <header className="navbar">

            <div className="navbar-inner">

                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={closeMenu}
                >
                    <img
                        src="/maqnet-kreasindo-logo.png"
                        alt="Maqnet Kreasindo"
                        className="navbar-brand-image"
                    />
                </Link>

                <button
                    type="button"
                    className={`navbar-toggle${menuOpen ? " is-open" : ""}`}
                    aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                    aria-expanded={menuOpen}
                    aria-controls="primary-navigation"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span />
                    <span />
                </button>

                <nav
                    className={`navbar-menu${menuOpen ? " is-open" : ""}`}
                    id="primary-navigation"
                >

                    <NavLink
                        to="/"
                        end
                        className="navbar-home-link"
                        onClick={closeMenu}
                    >
                        {t("home")}
                    </NavLink>

                    <NavLink to="/tentang" onClick={closeMenu}>
                        {t("about")}
                    </NavLink>

                    <NavLink to="/layanan" onClick={closeMenu}>
                        {t("services")}
                    </NavLink>

                    <NavLink to="/event" onClick={closeMenu}>
                        {t("events")}
                    </NavLink>

                    <NavLink to="/galeri" onClick={closeMenu}>
                        {t("gallery")}
                    </NavLink>

                    <NavLink to="/kontak" onClick={closeMenu}>
                        {t("contact")}
                    </NavLink>

                </nav>

                <div className="navbar-language-switch" role="group" aria-label={t("language")}>
                    <button
                        type="button"
                        className={language === "id" ? "active" : ""}
                        aria-label={t("indonesia")}
                        aria-pressed={language === "id"}
                        onClick={() => setLanguage("id")}
                    >
                        <svg className="language-flag" viewBox="0 0 30 20" aria-hidden="true">
                            <rect width="30" height="10" fill="#ce1126" />
                            <rect y="10" width="30" height="10" fill="#fff" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className={language === "en" ? "active" : ""}
                        aria-label={t("english")}
                        aria-pressed={language === "en"}
                        onClick={() => setLanguage("en")}
                    >
                        <svg className="language-flag" viewBox="0 0 60 30" aria-hidden="true">
                            <rect width="60" height="30" fill="#012169" />
                            <path d="M0 0 60 30M60 0 0 30" stroke="#fff" strokeWidth="6" />
                            <path d="M0 0 60 30M60 0 0 30" stroke="#c8102e" strokeWidth="2.4" />
                            <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
                            <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
                        </svg>
                    </button>
                </div>

                <Link
                    to="/kontak"
                    className="navbar-button"
                    onClick={closeMenu}
                >
                    {t("bookEvent")} <span aria-hidden="true">↗</span>
                </Link>

                <Link
                    to="/login"
                    className="navbar-account"
                    aria-label={t("adminLogin")}
                    onClick={closeMenu}
                >
                    <CircleUserRound size={17} aria-hidden="true" />
                </Link>

            </div>

        </header>
    );
}

export default Navbar;