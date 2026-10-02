import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import api from "../services/api";

function Home() {

    const [layanan, setLayanan] = useState([]);
    const [events, setEvents] = useState([]);
    const [galeri, setGaleri] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadData = async () => {

            try {

                const [
                    layananResponse,
                    eventResponse,
                    galeriResponse
                ] = await Promise.all([
                    api.get("/layanan/"),
                    api.get("/events/"),
                    api.get("/galeri/")
                ]);

                if (layananResponse.data.success) {
                    setLayanan(
                        layananResponse.data.data.slice(0, 3)
                    );
                }

                if (eventResponse.data.success) {
                    setEvents(
                        eventResponse.data.data.slice(0, 3)
                    );
                }

                if (galeriResponse.data.success) {
                    setGaleri(
                        galeriResponse.data.data.slice(0, 6)
                    );
                }

            } catch (error) {

                console.error(
                    "Home Error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        loadData();

    }, []);

    return (

        <div className="home">

            {/* HERO */}

            <section className="hero">
                <div className="hero-content">
                    <p className="hero-kicker">
                        <span aria-hidden="true" />
                        PREMIER EVENT ORGANIZER &amp; PRODUCTION
                    </p>
                    <h1>
                        <span>Create Moments.</span>
                        <strong>Celebrate Life.</strong>
                    </h1>
                    <p className="hero-description">
                        We turn your dream events into unforgettable experiences. Dari konsep eksklusif,
                        kurasi visual megah, hingga eksekusi panggung kelas dunia dengan presisi sempurna.
                    </p>
                    <div className="hero-buttons">
                        <Link
                            to="/layanan"
                            className="btn-primary"
                        >
                            EXPLORE OUR SERVICES
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                    <div className="hero-trust" aria-label="Komitmen Eventora">
                        <span><BadgeCheck size={13} aria-hidden="true" /> ISO 9001 CERTIFIED EVENT CREW</span>
                        <span><Sparkles size={13} aria-hidden="true" /> 5-STAR LUXURY VENUE PARTNERS</span>
                        <span><ShieldCheck size={13} aria-hidden="true" /> DISCREET VIP PRIVACY PROTOCOL</span>
                    </div>
                </div>
            </section>


            {/* INTRO */}

            <section className="home-intro">

                <div>

                    <p className="section-label">
                        WHO WE ARE
                    </p>

                    <h2>
                        Partner Anda Dalam
                        <br />
                        Menciptakan Event
                        <br />
                        Yang Berkesan.
                    </h2>

                </div>

                <div>

                    <p>
                        Eventora adalah perusahaan event organizer
                        yang membantu klien mewujudkan berbagai
                        konsep acara secara profesional.
                    </p>

                    <p>
                        Mulai dari perencanaan, konsep, koordinasi,
                        hingga pelaksanaan acara, kami memastikan
                        setiap detail berjalan dengan baik.
                    </p>

                    <Link
                        to="/tentang"
                        className="text-link"
                    >
                        Tentang Kami →
                    </Link>

                </div>

            </section>


            {/* SERVICES */}

            <section className="home-section">

                <div className="section-heading">

                    <div>

                        <p className="section-label">
                            OUR SERVICES
                        </p>

                        <h2>
                            Layanan Kami
                        </h2>

                    </div>

                    <Link
                        to="/layanan"
                        className="text-link"
                    >
                        Lihat Semua →
                    </Link>

                </div>


                {loading ? (

                    <p>
                        Memuat layanan...
                    </p>

                ) : (

                    <div className="service-grid">

                        {layanan.map((item) => (

                            <div
                                className="service-card"
                                key={item.id}
                            >

                                <span>
                                    0{item.id}
                                </span>

                                <h3>
                                    {item.nama_layanan}
                                </h3>

                                <p>
                                    {item.deskripsi}
                                </p>

                                <Link
                                    to="/kontak"
                                    className="card-link"
                                >
                                    Konsultasi →
                                </Link>

                            </div>

                        ))}

                    </div>

                )}

            </section>


            {/* EVENTS */}

            <section className="home-section home-events">

                <div className="section-heading">

                    <div>

                        <p className="section-label">
                            OUR EVENTS
                        </p>

                        <h2>
                            Event Terbaru
                        </h2>

                    </div>

                    <Link
                        to="/event"
                        className="text-link"
                    >
                        Lihat Semua →
                    </Link>

                </div>


                {loading ? (

                    <p>
                        Memuat event...
                    </p>

                ) : events.length === 0 ? (

                    <p>
                        Belum ada event.
                    </p>

                ) : (

                    <div className="event-home-grid">

                        {events.map((event) => (

                            <div
                                className="event-home-card"
                                key={event.id}
                            >

                                <div className="event-number">
                                    0{event.id}
                                </div>

                                <div>

                                    <p className="event-location">
                                        {event.lokasi}
                                    </p>

                                    <h3>
                                        {event.nama_event}
                                    </h3>

                                    <p>
                                        {event.deskripsi}
                                    </p>

                                    <small>
                                        {event.tanggal}
                                    </small>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>


            {/* GALLERY */}

            <section className="home-section">

                <div className="section-heading">

                    <div>

                        <p className="section-label">
                            OUR WORK
                        </p>

                        <h2>
                            Dokumentasi Event
                        </h2>

                    </div>

                    <Link
                        to="/galeri"
                        className="text-link"
                    >
                        Lihat Galeri →
                    </Link>

                </div>


                {galeri.length > 0 ? (

                    <div className="gallery-home-grid">

                        {galeri.map((item) => (

                            <div
                                className="gallery-home-item"
                                key={item.id}
                            >

                                <img
                                    src={`http://localhost:8000/uploads/${item.gambar}`}
                                    alt={item.judul}
                                />

                                <div>
                                    <h3>
                                        {item.judul}
                                    </h3>
                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <p>
                        Belum ada dokumentasi.
                    </p>

                )}

            </section>


            {/* CTA */}

            <section className="home-cta">

                <div>

                    <p className="section-label">
                        HAVE AN EVENT IN MIND?
                    </p>

                    <h2>
                        Let's Create
                        <br />
                        Something Amazing.
                    </h2>

                    <Link
                        to="/kontak"
                        className="cta-button"
                    >
                        Mulai Konsultasi →
                    </Link>

                </div>

            </section>

        </div>

    );
}

export default Home;