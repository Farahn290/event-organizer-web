import { Link } from "react-router-dom";

function Footer() {

    return (

        <footer className="footer">

            <div className="footer-main">

                <div className="footer-brand">

                    <Link
                        to="/"
                        className="footer-logo"
                    >
                        <img
                            src="/maqnet-kreasindo-logo.png"
                            alt="Maqnet Kreasindo"
                            className="footer-logo-image"
                        />
                    </Link>

                    <p>
                        Event Organizer profesional yang membantu
                        menciptakan acara kreatif, memorable,
                        dan berkesan.
                    </p>

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