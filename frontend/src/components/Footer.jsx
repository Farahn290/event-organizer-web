import { Link } from "react-router-dom";

function Footer() {

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
                        Event Organizer profesional yang membantu
                        menciptakan acara kreatif, memorable,
                        dan berkesan.
                    </p>

                    <div className="footer-social-icons" aria-label="Media sosial">
                        <span role="img" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                                <circle cx="12" cy="12" r="4" />
                                <circle className="footer-social-icon-fill" cx="17.6" cy="6.8" r="1" />
                            </svg>
                        </span>
                        <span role="img" aria-label="YouTube">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M21 7.2a2.8 2.8 0 0 0-2-2C17.2 4.7 12 4.7 12 4.7s-5.2 0-7 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2.5 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7 .5 7 .5s5.2 0 7-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-4.8 29 29 0 0 0-.5-4.8Z" />
                                <path className="footer-social-icon-dark" d="m10 15.5 5-3.5-5-3.5v7Z" />
                            </svg>
                        </span>
                        <span role="img" aria-label="Facebook">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="12" r="9.5" />
                                <path className="footer-social-icon-dark" d="M13.5 20.9v-7.6h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.5-1.5h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6v7.6h3.1Z" />
                            </svg>
                        </span>
                        <span role="img" aria-label="Threads">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M18.5 10.2c-.3-4.1-2.6-6.4-6.5-6.4-4.1 0-6.7 2.8-6.7 8.1 0 5.1 2.4 8.2 6.8 8.2 3.3 0 5.8-1.8 5.8-4.7 0-2.3-1.5-3.8-4.2-4.1-2.4-.3-3.6.6-3.6 2.1 0 1.2.9 2 2.2 2 1.8 0 3.1-1.7 3.1-4.1 0-2.8-1.6-4.4-4.1-4.4" />
                                <path d="M14.6 11c2.7.7 4.1 2.1 4.1 4.4" />
                            </svg>
                        </span>
                        <span role="img" aria-label="TikTok">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M14 3v11.1a4 4 0 1 1-3-3.9V7.1a7 7 0 1 0 6.2 7V9.8a8.4 8.4 0 0 0 4.3 1.2V7.7A4.8 4.8 0 0 1 17 6.3 4.8 4.8 0 0 1 15.7 3H14Z" />
                            </svg>
                        </span>
                    </div>

                </div>


                <div className="footer-column">

                    <h3>
                        Navigation
                    </h3>

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/tentang">
                        Tentang
                    </Link>

                    <Link to="/layanan">
                        Layanan
                    </Link>

                    <Link to="/event">
                        Event
                    </Link>

                </div>


                <div className="footer-column">

                    <h3>
                        Explore
                    </h3>

                    <Link to="/galeri">
                        Galeri
                    </Link>

                    <Link to="/kontak">
                        Kontak
                    </Link>

                    <Link to="/login">
                        Admin
                    </Link>

                </div>


                <div className="footer-column">

                    <h3>
                        Contact
                    </h3>

                    <p>
                        Jakarta, Indonesia
                    </p>

                    <p>
                        hello@eventora.com
                    </p>

                    <p>
                        +62 812-3456-7890
                    </p>

                </div>

            </div>


            <div className="footer-bottom">

                <p>
                    © 2026 Eventora. All rights reserved.
                </p>

                <p>
                    Event Organizer
                </p>

            </div>

        </footer>
    );
}

export default Footer;