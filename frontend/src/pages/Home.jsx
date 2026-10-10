import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, PartyPopper, Smile, Users } from "lucide-react";
import api from "../services/api";
import homeHeroImage1 from "../assets/home-hero-1.png";
import homeHeroImage2 from "../assets/home-hero-2.png";
import homeHeroImage3 from "../assets/home-hero-3-festival.png";
import homeHeroImage4 from "../assets/home-hero-4-ifg.png";
import homeHeroImage5 from "../assets/home-hero-5.png";

const heroImages = [
    homeHeroImage1,
    homeHeroImage2,
    homeHeroImage3,
    homeHeroImage4,
    homeHeroImage5
];

const homeStats = [
    {
        value: "150+",
        label: "Events Completed",
        description: "From intimate galas to arenas",
        Icon: PartyPopper
    },
    {
        value: "100+",
        label: "Happy Clients",
        description: "High-profile brands & families",
        Icon: Smile
    },
    {
        value: "10+",
        label: "Years Experience",
        description: "Industry standards of excellence",
        Icon: Award
    },
    {
        value: "50+",
        label: "Professional Team",
        description: "Directors, stage crew & designers",
        Icon: Users
    }
];

function Home() {

    const [layanan, setLayanan] = useState([]);
    const [events, setEvents] = useState([]);
    const [galeri, setGaleri] = useState([]);
    const [activeHeroImage, setActiveHeroImage] = useState(0);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
        const updateMotionPreference = () => setPrefersReducedMotion(motionPreference.matches);

        updateMotionPreference();
        motionPreference.addEventListener("change", updateMotionPreference);

        return () => motionPreference.removeEventListener("change", updateMotionPreference);
    }, []);

    useEffect(() => {
        if (prefersReducedMotion) return undefined;

        const intervalId = window.setInterval(() => {
            setActiveHeroImage((currentImage) => (currentImage + 1) % heroImages.length);
        }, 5000);

        return () => window.clearInterval(intervalId);
    }, [prefersReducedMotion]);

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
                <div className="hero-slideshow" aria-hidden="true">
                    {heroImages.map((image, index) => (
                        <img
                            className={`hero-slide${index === activeHeroImage ? " is-active" : ""}`}
                            src={image}
                            alt=""
                            key={image}
                        />
                    ))}
                </div>
                <div className="hero-content">
                    <p className="hero-kicker">
                        <span aria-hidden="true" />
                        PREMIER EVENT ORGANIZER &amp; PRODUCTION
                    </p>
                    <h1>
                        <span>Create Moments.</span>
                        <span className="hero-highlight">Celebrate Life.</span>
                    </h1>
                    <p className="hero-description">
                        We turn your dream events into unforgettable experiences. Dari konsep
                        eksklusif, kurasi visual mewah, hingga eksekusi panggung kelas dunia dengan
                        presisi sempurna.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/layanan" className="btn-primary">
                            Explore Our Services
                        </Link>
                    </div>
                </div>
            </section>

            <section className="home-stats" aria-label="Maqnet Kreasindo in numbers">
                <div className="home-stats-grid">
                    {homeStats.map(({ value, label, description, Icon }) => (
                        <article className="home-stat-card" key={label}>
                            <span className="home-stat-icon">
                                <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                            </span>
                            <strong>{value}</strong>
                            <h3>{label}</h3>
                            <p>{description}</p>
                        </article>
                    ))}
                </div>
            </section>


            {/* SERVICES */}

            <section className="home-section home-services">

                <div className="section-heading">

                    <div>

                        <p className="section-label">
                            OUR SERVICES
                        </p>

                        <h2>
                            Layanan <span className="home-services-title-accent">Kami</span>
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
                            Event <span className="home-section-title-accent">Terbaru</span>
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

            <section className="home-section home-gallery">

                <div className="section-heading">

                    <div>

                        <p className="section-label">
                            OUR WORK
                        </p>

                        <h2>
                            Dokumentasi <span className="home-section-title-accent">Event</span>
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

                <div className="home-cta-background" aria-hidden="true" />

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