import { Link, NavLink } from "react-router-dom";

function Navbar() {

    return (
        <header className="navbar">

            <div className="navbar-inner">

                <Link
                    to="/"
                    className="navbar-logo"
                >
                    EVENTORA
                </Link>

                <nav className="navbar-menu">

                    <NavLink
                        to="/"
                        end
                    >
                        Home
                    </NavLink>

                    <NavLink to="/tentang">
                        Tentang
                    </NavLink>

                    <NavLink to="/layanan">
                        Layanan
                    </NavLink>

                    <NavLink to="/event">
                        Event
                    </NavLink>

                    <NavLink to="/galeri">
                        Galeri
                    </NavLink>

                    <NavLink to="/kontak">
                        Kontak
                    </NavLink>

                </nav>

                <Link
                    to="/kontak"
                    className="navbar-button"
                >
                    Let's Talk →
                </Link>

            </div>

        </header>
    );
}

export default Navbar;