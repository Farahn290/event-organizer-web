import { useEffect, useState } from "react";
import { useMemo } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

const categories = ["All Events", "Wedding", "Birthday", "Corporate", "Concert"];

const sampleEvents = [
    {
        id: "archive-wedding",
        nama_event: "The Royal Celestial Gala",
        tanggal: "2025",
        lokasi: "Ritz Carlton Ballroom, Jakarta (1,200 Guests)",
        kategori: "Wedding",
        produksi: "GRAND PRODUCTION",
        gambar: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85"
    },
    {
        id: "archive-concert",
        nama_event: "Neon Horizon Music Fest",
        tanggal: "2025",
        lokasi: "Senayan Arena, Jakarta (15,000 Spectators)",
        kategori: "Concert",
        produksi: "FESTIVAL RIGGING",
        gambar: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1000&q=85"
    },
    {
        id: "archive-corporate",
        nama_event: "Apex Global Tech Summit",
        tanggal: "2025",
        lokasi: "BICC Convention Centre, Bali (3,500 Delegates)",
        kategori: "Corporate",
        produksi: "HYBRID MULTI-STAGE",
        gambar: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=85"
    },
    {
        id: "archive-birthday",
        nama_event: "Golden Mirage 21st Soiree",
        tanggal: "2026",
        lokasi: "Plataran Dharmawangsa, Jakarta (250 VIP Guests)",
        kategori: "Birthday",
        produksi: "THEMATIC LUXURY",
        gambar: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85"
    },
    {
        id: "archive-symphony",
        nama_event: "Aura Symphony Orchestral Night",
        tanggal: "2025",
        lokasi: "Grand Theater Hall, Surabaya (1,800 Seats)",
        kategori: "Concert",
        produksi: "ACOUSTIC ENGINEERING",
        gambar: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85"
    },
    {
        id: "archive-nuptials",
        nama_event: "Luxe Emerald Botanical Nuptials",
        tanggal: "2026",
        lokasi: "Alila Villas Uluwatu, Bali (350 Guests)",
        kategori: "Wedding",
        produksi: "DESTINATION NUPTIALS",
        gambar: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85"
    }
];

const categoryByName = (event, index) => {
    if (event.kategori) return event.kategori;

    const name = (event.nama_event || "").toLowerCase();
    if (/wedding|nuptial|pernikahan/.test(name)) return "Wedding";
    if (/birthday|soiree|ulang tahun/.test(name)) return "Birthday";
    if (/concert|festival|music|musik|symphony|konser/.test(name)) return "Concert";
    if (/corporate|summit|company|launch|gathering/.test(name)) return "Corporate";

    return sampleEvents[index % sampleEvents.length].kategori;
};

const eventImage = (event, index) => (
    event.gambar?.startsWith("http")
        ? event.gambar
        : event.gambar
            ? `http://localhost:8000/uploads/${event.gambar}`
            : sampleEvents[index % sampleEvents.length].gambar
);

function Event() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeCategory, setActiveCategory] = useState("All Events");

    useEffect(() => {

        const getEvents = async () => {

            try {

                const response = await api.get("/events/");

                console.log("Event API:", response.data);

                if (response.data.success) {

                    setEvents(
                        response.data.data.length > 0
                            ? response.data.data
                            : sampleEvents
                    );

                } else {

                    setError(
                        response.data.message ||
                        "Gagal mengambil data event"
                    );

                }

            } catch (error) {

                console.error("Event Error:", error);

                setEvents(sampleEvents);

            } finally {

                setLoading(false);

            }
        };

        getEvents();

    }, []);

    const visibleEvents = useMemo(() => (
        activeCategory === "All Events"
            ? events
            : events.filter((event, index) => categoryByName(event, index) === activeCategory)
    ), [activeCategory, events]);

    return (
        <div className="page event-archive-page">

            <section className="event-archive">
                <header className="event-archive-header">
                    <div className="event-archive-title">
                        <p>CURATED ARCHIVES</p>
                        <h1>Our Recent<br />Masterpieces</h1>
                    </div>

                    <div className="event-filters" role="group" aria-label="Filter kategori event">
                        {categories.map((category) => (
                            <button
                                type="button"
                                key={category}
                                className={activeCategory === category ? "active" : ""}
                                aria-pressed={activeCategory === category}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </header>

                {loading && <p className="event-archive-state" role="status">Memuat event...</p>}

                {!loading && error && <p className="event-archive-state" role="alert">{error}</p>}

                {!loading && visibleEvents.length === 0 && (
                    <p className="event-archive-state">Belum ada event dalam kategori ini.</p>
                )}

                {!loading && !error && visibleEvents.length > 0 && (
                    <div className="event-archive-grid">
                        {visibleEvents.map((event, index) => {
                            const category = categoryByName(event, index);
                            const image = eventImage(event, index);
                            const year = String(event.tanggal || "").match(/\d{4}/)?.[0] || "2025";

                            return (
                                <article className="event-archive-card" key={event.id}>
                                    <div className="event-archive-image">
                                        <img src={image} alt={event.nama_event} />
                                        <span className="event-archive-tag">
                                            {category.toUpperCase()} · {year}
                                        </span>
                                    </div>
                                    <div className="event-archive-card-body">
                                        <h2>{event.nama_event}</h2>
                                        <p className="event-archive-location">
                                            <MapPin size={12} aria-hidden="true" />
                                            <span>{event.lokasi}</span>
                                        </p>
                                        {event.deskripsi && (
                                            <p className="event-archive-description">{event.deskripsi}</p>
                                        )}
                                        <div className="event-archive-footer">
                                            <span>{event.produksi || sampleEvents[index % sampleEvents.length].produksi}</span>
                                            <Link to="/kontak" aria-label={`Konsultasi untuk ${event.nama_event}`}>
                                                <ArrowRight size={15} aria-hidden="true" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

        </div>
    );
}

export default Event;