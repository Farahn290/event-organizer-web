import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, PartyPopper, Smile, Users } from "lucide-react";
import api from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import homeHeroImage1 from "../assets/home-hero-1.png";
import homeHeroImage2 from "../assets/home-hero-2.png";
import homeHeroImage3 from "../assets/home-hero-3-festival.png";
import homeHeroImage4 from "../assets/home-hero-4-ifg.png";
import homeHeroImage5 from "../assets/home-hero-5.png";

const heroImages = [
    homeHeroImage2,
    homeHeroImage1,
    homeHeroImage3,
    homeHeroImage4,
    homeHeroImage5
];

const featuredClients = Array.from({ length: 24 }, (_, index) =>
    `/client-logos/logo-${String(index + 1).padStart(2, "0")}.png`
);
const featuredClientRows = [
    featuredClients.slice(0, 12),
    featuredClients.slice(12)
];

const homeStats = [
    {
        value: "150+",
        label: "eventsCompleted",
        description: "intimateGalas",
        Icon: PartyPopper
    },
    {
        value: "100+",
        label: "happyClients",
        description: "highProfile",
        Icon: Smile
    },
    {
        value: "10+",
        label: "yearsExperience",
        description: "industryStandards",
        Icon: Award
    },
    {
        value: "50+",
        label: "professionalTeam",
        description: "teamDescription",
        Icon: Users
    }
];

function Home() {
    const { t } = useLanguage();

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
                    <div
                        className="hero-slideshow-track"
                        style={{
                            width: `${heroImages.length * 100}%`,
                            transform: `translateX(-${activeHeroImage * (100 / heroImages.length)}%)`
                        }}
                    >
                        {heroImages.map((image, index) => (
                            <img
                                className={`hero-slide${index === activeHeroImage ? " is-active" : ""}`}
                                src={image}
                                alt=""
                                key={image}
                                style={{ flexBasis: `${100 / heroImages.length}%` }}
                            />
                        ))}
                    </div>
                </div>
                <div className="hero-content">
                    <p className="hero-kicker">
                        <span aria-hidden="true" />
                        {t("heroKicker")}
                    </p>
                    <h1>
                        <span>{t("heroCreateMoments")}</span>
                        <span className="hero-highlight">{t("heroCelebrateLife")}</span>
                    </h1>
                    <p className="hero-description">
                        {t("heroDescription")}
                    </p>
                    <div className="hero-buttons">
                        <Link to="/layanan" className="btn-primary">
                            {t("exploreServices")} <span aria-hidden="true">↗</span>
                        </Link>
                        <Link to="/kontak" className="btn-secondary">
                            {t("contactUs")}
                        </Link>
                    </div>
                </div>
                <div className="home-stats" aria-label="Maqnet Kreasindo in numbers">
                    <div className="home-stats-grid">
                        {homeStats.map(({ value, label, description, Icon }) => (
                            <article className="home-stat-card" key={label}>
                                <span className="home-stat-icon">
                                    <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                                </span>
                                <div className="home-stat-content">
                                    <strong>{value}</strong>
                                    <h3>{t(label)}</h3>
                                    <p>{t(description)}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>


            <div className="home-feature-grid">

                {/* SERVICES */}

                <section className="home-section home-services">
                <span className="home-feature-watermark" aria-hidden="true">SERVICES</span>

                <div className="section-heading">

                    <div>

                        <p className="section-label">
                            {t("ourServices")}
                        </p>

                        <h2>
                            {t("services")}
                        </h2>
                        <p className="home-services-description">
                            {t("serviceDescription")}
                        </p>

                    </div>

                    <Link
                        to="/layanan"
                        className="text-link"
                    >
                        {t("seeAll")} →
                    </Link>

                </div>


                {loading ? (

                    <p>
                        {t("loadingServices")}
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
                                    {t("consultation")} →
                                </Link>

                            </div>

                        ))}

                    </div>

                )}

                </section>


                {/* EVENTS */}

                <section className="home-section home-events">
                <span className="home-feature-watermark" aria-hidden="true">EVENT</span>

                <div className="section-heading">

                    <div>

                        <p className="section-label">
                            {t("ourEvents")}
                        </p>

                        <h2>
                            {t("latestEvents")}
                        </h2>
                        <p className="home-section-description">
                            {t("latestEventDescription")}
                        </p>

                    </div>

                    <Link
                        to="/event"
                        className="text-link"
                    >
                        {t("seeAll")} →
                    </Link>

                </div>


                {loading ? (

                    <p>
                        {t("loadingEvents")}
                    </p>

                ) : events.length === 0 ? (

                    <p>
                        {t("noEvents")}
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
                <span className="home-feature-watermark" aria-hidden="true">GALLERY</span>

                <div className="section-heading">

                    <div>

                        <p className="section-label">
                            {t("ourGallery")}
                        </p>

                        <h2>
                            {t("gallery")}
                        </h2>
                        <p className="home-section-description">
                            {t("galleryDescription")}
                        </p>

                    </div>

                    <Link
                        to="/galeri"
                        className="text-link"
                    >
                        {t("seeAll")} {t("gallery")} →
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

            </div>

            <section className="home-featured-clients" aria-label="Pelanggan unggulan">
                <div className="hero-clients">
                    <p className="hero-clients-label">{t("featuredClients")}</p>
                    <div className="hero-clients-window">
                        <div className="hero-clients-rows">
                            {featuredClientRows.map((row, rowIndex) => (
                                <div
                                    className={`hero-clients-track${rowIndex === 1 ? " hero-clients-track--reverse" : ""}`}
                                    key={`client-row-${rowIndex}`}
                                >
                                    <div className="hero-clients-group">
                                        {row.map((logo, index) => (
                                            <span className="hero-client-logo" key={logo}>
                                                <img src={logo} alt={`Logo pelanggan ${rowIndex * 12 + index + 1}`} />
                                            </span>
                                        ))}
                                    </div>
                                    <div className="hero-clients-group" aria-hidden="true">
                                        {row.map((logo) => (
                                            <span className="hero-client-logo" key={logo}>
                                                <img src={logo} alt="" />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* CTA */}

            <section className="home-cta">
                <div className="home-cta-content">
                    <p className="home-cta-eyebrow">{t("haveEvent")}</p>
                    <h2>
                        {t("createMoments")}
                        <br />
                        <span>{t("somethingAmazing")}</span>
                    </h2>
                    <p className="home-cta-description">
                        {t("ctaDescription")}
                    </p>
                    <Link
                        to="/kontak"
                        className="cta-button"
                    >
                        {t("startConsultation")} <span aria-hidden="true">→</span>
                    </Link>
                </div>

                <div className="home-cta-visuals">
                    <img
                        className="home-cta-infographic"
                        src="/home-services-infographic.png"
                        alt="Infografik layanan Out of Home Advertisement, Event Management, Exhibition Contractor, dan One Stop Printing Solution"
                    />
                </div>
            </section>

        </div>

    );
}

export default Home;