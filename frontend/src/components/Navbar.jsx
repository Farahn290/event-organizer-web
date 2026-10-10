import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CircleUserRound } from "lucide-react";

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

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
                    aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
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
                        onClick={closeMenu}
                    >
                        Home
                    </NavLink>

                    <NavLink to="/tentang" onClick={closeMenu}>
                        Tentang
                    </NavLink>

                    <NavLink to="/layanan" onClick={closeMenu}>
                        Layanan
                    </NavLink>

                    <NavLink to="/event" onClick={closeMenu}>
                        Event
                    </NavLink>

                    <NavLink to="/galeri" onClick={closeMenu}>
                        Galeri
                    </NavLink>

                    <NavLink to="/kontak" onClick={closeMenu}>
                        Kontak
                    </NavLink>

                </nav>

                <Link
                    to="/kontak"
                    className="navbar-button"
                    onClick={closeMenu}
                >
                    BOOK YOUR EVENT <span aria-hidden="true">↗</span>
                </Link>

                <Link
                    to="/login"
                    className="navbar-account"
                    aria-label="Admin login"
                    onClick={closeMenu}
                >
                    <CircleUserRound size={17} aria-hidden="true" />
                </Link>

            </div>

        </header>
    );
}

export default Navbar;