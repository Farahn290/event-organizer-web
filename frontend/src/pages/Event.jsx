import { useEffect, useState } from "react";
import { useMemo } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Images, MapPin, Star, X } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

const categories = ["All Events", "Wedding", "Birthday", "Corporate", "Concert"];

const sampleEvents = [
    {
        id: "archive-wedding",
        nama_event: "MYPERTAMINA X TURBO",
        tanggal: "2023",
        lokasi: "HotelSarina",
        kategori: "Wedding",
        label: "MYPERTAMINA",
        produksi: " ",
        gambar: "/wedding-2025-pertamina-display.png"
    },
    {
        id: "archive-concert",
        nama_event: "BRIGHT GAS",
        tanggal: "2025",
        lokasi: "Mall Sarinah Jakarta)",
        kategori: "Concert",
        label: "IHC & BRIGHT GAS",
        produksi: "",
        gambar: "/concert-2025-brightgas.png"
    },
    {
        id: "archive-corporate",
        nama_event: "Indonesia Financial TeamGroup.",
        tanggal: "2025",
        lokasi: "Jakarta International Convention Center",
        kategori: "Corporate",
        produksi: "",
        gambar: "/corporate-2025-ifg.png"
    },
    {
        id: "archive-birthday",
        nama_event: "FESTIVAL KOPLO",
        tanggal: "2026",
        lokasi: "Jakarta Senayan",
        kategori: "Concert",
        label: "FESTIVAL KOPLO",
        produksi: "",
        gambar: "/festival-koplo-gallery-1.png"
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

const myPertaminaTestPhotos = [
    "/mypertamina-gallery-1.png",
    "/mypertamina-gallery-2.png",
    "/mypertamina-gallery-3.png",
    "/mypertamina-gallery-4.png",
    "/mypertamina-gallery-5.png",
    "/mypertamina-gallery-6.png",
    "/mypertamina-gallery-7.png",
    "/mypertamina-gallery-8.png",
    "/mypertamina-gallery-9.png",
    "/mypertamina-gallery-10.png"
];

const brightGasTestPhotos = [
    "/brightgas-gallery-1.png",
    "/brightgas-gallery-2.png",
    "/brightgas-gallery-3.png",
    "/brightgas-gallery-4.png",
    "/brightgas-gallery-5.png",
    "/brightgas-gallery-6.png",
    "/brightgas-gallery-7.png",
    "/brightgas-gallery-8.png",
    "/brightgas-gallery-9.png"
];

const ifgTestPhotos = [
    "/ifg-gallery-1.png",
    "/ifg-gallery-2.png",
    "/ifg-gallery-3.png",
    "/ifg-gallery-4.png",
    "/ifg-gallery-5.png",
    "/ifg-gallery-6.png",
    "/ifg-gallery-7.png",
    "/ifg-gallery-8.png",
    "/ifg-gallery-9.png",
    "/ifg-gallery-10.png"
];

const festivalKoploPhotos = [
    "/festival-koplo-gallery-1.png",
    "/festival-koplo-gallery-2.png",
    "/festival-koplo-gallery-3.png",
    "/festival-koplo-gallery-4.png",
    "/festival-koplo-gallery-5.png",
    "/festival-koplo-gallery-6.png",
    "/festival-koplo-gallery-7.png",
    "/festival-koplo-gallery-8.png",
    "/festival-koplo-gallery-9.png",
    "/festival-koplo-gallery-10.png"
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
            ? event.gambar.startsWith("/")
                ? event.gambar
                : `http://localhost:8000/uploads/${event.gambar}`
            : sampleEvents[index % sampleEvents.length].gambar
);

const galleryImage = (image) => {
    if (!image) return "";
    if (image.startsWith("http") || image.startsWith("/")) return image;
    return `http://localhost:8000/uploads/${image}`;
};

const galleryPhotosFor = (event, coverImage) => {
    const eventPhotos = Array.isArray(event.galeri)
        ? event.galeri.map((photo) => galleryImage(photo.gambar)).filter(Boolean)
        : [];
    const isFestivalKoploEvent = /festival\s+koplo/i.test(event.nama_event || "");
    const isMyPertaminaEvent = /mypertamina/i.test(event.nama_event || "");
    const isBrightGasEvent = /bright\s*gas/i.test(event.nama_event || "");
    const isIfgEvent = /\bifg\b|financial.*group/i.test(event.nama_event || "");
    if (isFestivalKoploEvent) {
        return [...eventPhotos, ...festivalKoploPhotos]
            .filter((photo, index, photos) => photo && photos.indexOf(photo) === index);
    }

    const photos = isIfgEvent
        ? [...eventPhotos, ...ifgTestPhotos]
        : isBrightGasEvent
            ? [...(eventPhotos.length > 0 ? eventPhotos : brightGasTestPhotos), coverImage]
        : eventPhotos.length > 0
            ? eventPhotos
            : isMyPertaminaEvent
                ? myPertaminaTestPhotos
                : [coverImage];

    return photos.filter((photo, index) => photo && photos.indexOf(photo) === index);
};

function Event() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeCategory, setActiveCategory] = useState("All Events");
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);

    useEffect(() => {
        if (!selectedGallery) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSelectedGallery(null);
            } else if (event.key === "ArrowRight") {
                setActivePhotoIndex((index) => (index + 1) % selectedGallery.photos.length);
            } else if (event.key === "ArrowLeft") {
                setActivePhotoIndex((index) => (
                    (index - 1 + selectedGallery.photos.length) % selectedGallery.photos.length
                ));
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedGallery]);

    const openGallery = (event, image) => {
        setSelectedGallery({ event, photos: galleryPhotosFor(event, image) });
        setActivePhotoIndex(0);
    };

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
                        <Star size={16} fill="currentColor" aria-hidden="true" />
                        <h1>Our Recent Masterpieces</h1>
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
                            const year = String(event.tanggal || "").match(/\d{4}/)?.[0] || "2025";
                            const image = year === "2025" && category === "Wedding"
                                ? "/wedding-2025-pertamina-display.png"
                                : year === "2025" && category === "Concert"
                                    ? "/concert-2025-brightgas.png"
                                    : year === "2025" && category === "Corporate"
                                        ? "/corporate-2025-ifg.png"
                                    : eventImage(event, index);
                            const photoCount = galleryPhotosFor(event, image).length;

                            return (
                                <article
                                    className="event-archive-card"
                                    key={event.id}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Lihat galeri berisi ${photoCount} foto untuk ${event.nama_event}`}
                                    onClick={() => openGallery(event, image)}
                                    onKeyDown={(keyEvent) => {
                                        if (keyEvent.target !== keyEvent.currentTarget) return;
                                        if (keyEvent.key === "Enter" || keyEvent.key === " ") {
                                            keyEvent.preventDefault();
                                            openGallery(event, image);
                                        }
                                    }}
                                >
                                    <div className={`event-archive-image${category === "Concert" && year === "2025" ? " event-archive-image--concert-2025" : ""}${event.id === "archive-birthday" ? " event-archive-image--full" : ""}`}>
                                        <img src={image} alt={event.nama_event} />
                                        <span className="event-archive-tag">
                                            {(event.label || category).toUpperCase()} · {year}
                                        </span>
                                        <span className="event-archive-gallery-hint">
                                            <Images size={13} aria-hidden="true" />
                                            <span className="event-archive-gallery-count">{photoCount}</span>
                                            <span className="event-archive-gallery-label">
                                                Jelajahi galeri <ArrowRight size={12} aria-hidden="true" />
                                            </span>
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
                                            <Link
                                                to="/kontak"
                                                aria-label={`Konsultasi untuk ${event.nama_event}`}
                                                onClick={(clickEvent) => clickEvent.stopPropagation()}
                                                onKeyDown={(keyEvent) => keyEvent.stopPropagation()}
                                            >
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

            {selectedGallery && (
                <div
                    className="event-gallery-modal"
                    role="presentation"
                    onClick={() => setSelectedGallery(null)}
                >
                    <section
                        className="event-gallery-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Foto event ${selectedGallery.event.nama_event}`}
                        onClick={(clickEvent) => clickEvent.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="event-gallery-close"
                            aria-label="Tutup galeri"
                            onClick={() => setSelectedGallery(null)}
                        >
                            <X size={20} aria-hidden="true" />
                        </button>

                        <div className="event-gallery-stage">
                            <img
                                src={selectedGallery.photos[activePhotoIndex]}
                                alt={`${selectedGallery.event.nama_event}, foto ${activePhotoIndex + 1}`}
                            />
                            {selectedGallery.photos.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        className="event-gallery-nav event-gallery-nav--previous"
                                        aria-label="Foto sebelumnya"
                                        onClick={() => setActivePhotoIndex((index) => (
                                            (index - 1 + selectedGallery.photos.length) % selectedGallery.photos.length
                                        ))}
                                    >
                                        <ChevronLeft size={24} aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        className="event-gallery-nav event-gallery-nav--next"
                                        aria-label="Foto berikutnya"
                                        onClick={() => setActivePhotoIndex((index) => (
                                            (index + 1) % selectedGallery.photos.length
                                        ))}
                                    >
                                        <ChevronRight size={24} aria-hidden="true" />
                                    </button>
                                </>
                            )}
                        </div>

                        <footer className="event-gallery-caption">
                            <div>
                                <h2>{selectedGallery.event.nama_event}</h2>
                                <p>{selectedGallery.event.lokasi}</p>
                            </div>
                            <span>{activePhotoIndex + 1} / {selectedGallery.photos.length}</span>
                        </footer>
                    </section>
                </div>
            )}

        </div>
    );
}

export default Event;