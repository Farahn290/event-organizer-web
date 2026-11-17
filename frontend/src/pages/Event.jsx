import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Images, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { buildUploadUrl } from "../services/media";
import { useLanguage } from "../contexts/LanguageContext";

const categoryDescriptionKeys = {
    Wedding: "eventDescriptionWedding",
    Birthday: "eventDescriptionBirthday",
    Corporate: "eventDescriptionCorporate",
    Concert: "eventDescriptionConcert"
};
const eventGalleryAccents = ["#f2ca75", "#62e4ea", "#9b9bff", "#f4a77b", "#62e4ea", "#9b9bff"];
const isStrategicIfgGathering = (event) => (
    /my\s*pertamina\s*metaverse|gathering\s+mitra\s+strategis\s+ifg/i.test(event.nama_event || "")
);
const strategicIfgGatheringDescription = "Penyelenggaraan acara gathering mitra strategis yang mempertemukan jajaran perusahaan, mitra bisnis, dan pemangku kepentingan. Acara ini dirancang sebagai wadah mempererat hubungan kerja sama, membangun komunikasi, serta memperkuat sinergi dalam mencapai tujuan bisnis bersama.";
const isFestivalKoplo = (event) => /festival\s+koplo/i.test(event.nama_event || "");
const festivalKoploDescription = "Penyelenggaraan festival musik koplo yang berkolaborasi dengan Pertamina, menghadirkan hiburan musik secara langsung dengan suasana meriah dan interaktif. Acara ini menggabungkan pertunjukan musik, aktivasi brand, serta pengalaman hiburan bagi masyarakat untuk meningkatkan antusiasme pengunjung dan memperkuat kedekatan brand dengan audiens.";
const isNusantaraSkyEvent = (event) => /nusantara\s+sky/i.test(event.nama_event || "");
const nusantaraSkyDescription = "Penyelenggaraan event olahraga dirgantara Nusantara SKY yang menghadirkan pertunjukan terjun payung (skydiving) dengan aksi penerjunan spektakuler dari atlet profesional. Acara ini menggabungkan atraksi udara, hiburan, serta pengalaman menarik bagi pengunjung dalam suasana yang meriah dan penuh antusiasme.";
const auraSymphonyPhotos = [
    "/aura-symphony-event-photo.png",
    "/aura-symphony-gallery-2.png",
    "/aura-symphony-gallery-3.png",
    "/aura-symphony-gallery-4.png",
    "/aura-symphony-gallery-5.png",
    "/aura-symphony-gallery-6.png"
];
const luxeEmeraldPhotos = [
    "/luxe-emerald-gallery-1.png",
    "/luxe-emerald-gallery-2.png",
    "/luxe-emerald-gallery-3.png",
    "/luxe-emerald-gallery-4.png",
    "/luxe-emerald-gallery-5.png",
    "/luxe-emerald-gallery-6.png",
    "/luxe-emerald-gallery-7.png"
];

const sampleEvents = [
    {
        id: "archive-wedding",
        nama_event: "MYPERTAMINA X TURBO",
        tanggal: "2023",
        lokasi: "jakarta teater",
        kategori: "Wedding",
        label: "MYPERTAMINA",
        gambar: "/wedding-2025-pertamina-display.png"
    },
    {
        id: "archive-concert",
        nama_event: "BRIGHT GAS",
        tanggal: "2025",
        lokasi: "Mall Sarinah Jakarta",
        kategori: "Concert",
        label: "IHC & BRIGHT GAS",
        gambar: "/concert-2025-brightgas.png",
        deskripsi: "Aktivasi brand Bright Gas melalui penyelenggaraan event interaktif yang menghadirkan pengalaman menarik bagi pengunjung. Menggabungkan konsep pameran, hiburan, dan promosi produk dengan desain area yang atraktif untuk meningkatkan brand awareness dan keterlibatan audiens."
    },
    {
        id: "archive-corporate",
        nama_event: "Indonesia Financial Group",
        tanggal: "2025",
        lokasi: "Jakarta International Convention Center",
        kategori: "IFG & Danantara",
        gambar: "/corporate-2025-ifg.png",
        deskripsi: "Penyelenggaraan acara korporat Indonesia Financial Group yang mencakup konferensi, seminar, dan pertemuan bisnis. Menghadirkan pengelolaan acara secara profesional mulai dari penataan venue, panggung, audiovisual, hingga koordinasi peserta untuk menciptakan acara yang tertata dan berkesan."
    },
    {
        id: "archive-birthday",
        nama_event: "FESTIVAL KOPLO X PERTAMINA",
        tanggal: "2026",
        lokasi: "Jakarta Senayan",
        kategori: "Concert",
        label: "FESTIVAL KOPLO X PERTAMINA",
        gambar: "/festival-koplo-gallery-1.png",
        deskripsi: festivalKoploDescription
    },
    {
        id: "archive-symphony",
        nama_event: "Nusantara SKY",
        tanggal: "2025",
        lokasi: "Puncak, Bogor Cisarua",
        kategori: "Adventure",
        gambar: "/aura-symphony-cover.png",
        deskripsi: nusantaraSkyDescription
    },
    {
        id: "archive-nuptials",
        nama_event: "GATHERING MITRA STRATEGIS IFG",
        tanggal: "2026",
        lokasi: "Hotel borobudur",
        kategori: "Brand",
        gambar: "/luxe-emerald-botanical-photo.png",
        deskripsi: strategicIfgGatheringDescription
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

const myPertaminaMetaversePhotos = [
    "/mypertamina-metaverse-gallery-1.png",
    "/mypertamina-metaverse-gallery-2.png",
    "/mypertamina-metaverse-gallery-3.png",
    "/mypertamina-metaverse-gallery-4.png",
    "/mypertamina-metaverse-gallery-5.png",
    "/mypertamina-metaverse-gallery-6.png",
    "/mypertamina-metaverse-gallery-7.png",
    "/mypertamina-metaverse-gallery-8.png",
    "/mypertamina-metaverse-gallery-9.png",
    "/mypertamina-metaverse-gallery-10.png"
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
                : buildUploadUrl(event.gambar)
            : sampleEvents[index % sampleEvents.length].gambar
);

const galleryPhotosFor = (event, coverImage) => {
    const eventPhotos = Array.isArray(event.galeri)
        ? event.galeri.map((photo) => buildUploadUrl(photo.gambar)).filter(Boolean)
        : [];
    const isFestivalKoploEvent = isFestivalKoplo(event);
    const isMyPertaminaEvent = /mypertamina/i.test(event.nama_event || "");
    const isMyPertaminaMetaverseEvent = isStrategicIfgGathering(event);
    const isBrightGasEvent = /bright\s*gas/i.test(event.nama_event || "");
    const isAuraSymphonyEvent = /aura\s+symphony|nusantara\s+sky/i.test(event.nama_event || "");
    const isLuxeEmeraldEvent = /luxe\s+emerald\s+botanical\s+nuptials/i.test(event.nama_event || "");
    const isIfgEvent = /\bifg\b|financial.*group/i.test(event.nama_event || "");
    if (isMyPertaminaMetaverseEvent) {
        return myPertaminaMetaversePhotos;
    }

    if (isFestivalKoploEvent) {
        return [...eventPhotos, ...festivalKoploPhotos]
            .filter((photo, index, photos) => photo && photos.indexOf(photo) === index);
    }

    const photos = isAuraSymphonyEvent
        ? [...eventPhotos, coverImage, ...auraSymphonyPhotos]
        : isLuxeEmeraldEvent
            ? [...eventPhotos, coverImage, ...luxeEmeraldPhotos]
            : isIfgEvent
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
    const { t } = useLanguage();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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

    const openGallery = (event, image, index) => {
        setSelectedGallery({
            event,
            photos: galleryPhotosFor(event, image),
            accent: eventGalleryAccents[index] || "#f2ca75"
        });
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

    return (
        <div className="page event-archive-page">

            <section className="event-archive">
                <header className="event-archive-header">
                    <div className="event-archive-title">
                        <span className="event-archive-eyebrow">{t("eventsEyebrow")}</span>
                        <h1>{t("recentMasterpieces")}</h1>
                        <p>{t("eventsIntro")}</p>
                    </div>

                    <div className="event-filters" role="group" aria-label={t("categoryFilter")}>
                        <button type="button" className="active" aria-pressed="true">
                            {t("allEvents")}
                        </button>
                    </div>
                </header>

                {loading && <p className="event-archive-state" role="status">{t("loadingEventsPage")}</p>}

                {!loading && error && <p className="event-archive-state" role="alert">{error}</p>}

                {!loading && events.length === 0 && (
                    <p className="event-archive-state">{t("noEventsCategory")}</p>
                )}

                {!loading && !error && events.length > 0 && (
                    <div className="event-archive-grid">
                        {events.map((event, index) => {
                            const isNusantaraSky = isNusantaraSkyEvent(event);
                            const category = isNusantaraSky ? "Adventure" : categoryByName(event, index);
                            const year = String(event.tanggal || "").match(/\d{4}/)?.[0] || "2025";
                            const isStrategicIfgGatheringEvent = isStrategicIfgGathering(event);
                            const isFestivalKoploEvent = isFestivalKoplo(event);
                            const eventName = isStrategicIfgGatheringEvent
                                ? "GATHERING MITRA STRATEGIS IFG"
                                : isFestivalKoploEvent
                                    ? "FESTIVAL KOPLO X PERTAMINA"
                                    : event.nama_event;
                            const isAuraSymphonyEvent = /aura\s+symphony|nusantara\s+sky/i.test(event.nama_event || "");
                            const isLuxeEmeraldEvent = /luxe\s+emerald\s+botanical\s+nuptials/i.test(event.nama_event || "");
                            const image = isAuraSymphonyEvent
                                ? "/aura-symphony-cover.png"
                                : isLuxeEmeraldEvent
                                    ? "/luxe-emerald-botanical-photo.png"
                                    : year === "2025" && category === "Wedding"
                                    ? "/wedding-2025-pertamina-display.png"
                                    : year === "2025" && category === "Concert"
                                        ? "/concert-2025-brightgas.png"
                                        : year === "2025" && category === "Corporate"
                                            ? "/corporate-2025-ifg.png"
                                            : eventImage(event, index);
                            const photoCount = galleryPhotosFor(event, image).length;
                            const description = isStrategicIfgGatheringEvent
                                ? strategicIfgGatheringDescription
                                : isFestivalKoploEvent
                                    ? festivalKoploDescription
                                    : isNusantaraSky
                                        ? nusantaraSkyDescription
                                        : event.deskripsi?.trim()
                                            || t(categoryDescriptionKeys[category] || "eventDescriptionDefault");
                            const presentedEvent = eventName === event.nama_event
                                ? event
                                : { ...event, nama_event: eventName };

                            return (
                                <article
                                    className="event-archive-card"
                                    key={event.id}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={t("seeEventGallery", { count: photoCount, name: eventName })}
                                    onClick={() => openGallery(presentedEvent, image, index)}
                                    onKeyDown={(keyEvent) => {
                                        if (keyEvent.target !== keyEvent.currentTarget) return;
                                        if (keyEvent.key === "Enter" || keyEvent.key === " ") {
                                            keyEvent.preventDefault();
                                            openGallery(presentedEvent, image, index);
                                        }
                                    }}
                                >
                                    <div className={`event-archive-image${category === "Concert" && year === "2025" ? " event-archive-image--concert-2025" : ""}${event.id === "archive-birthday" ? " event-archive-image--full" : ""}`}>
                                        <img src={image} alt={eventName} />
                                        <span className="event-archive-date">{year}</span>
                                        <span className="event-archive-gallery-hint">
                                            <Images size={13} aria-hidden="true" />
                                            <span className="event-archive-gallery-count">{photoCount}</span>
                                            <span className="event-archive-gallery-label">
                                                {t("exploreGallery")} <ArrowRight size={12} aria-hidden="true" />
                                            </span>
                                        </span>
                                    </div>
                                    <span className="event-archive-tag">
                                        {(isFestivalKoploEvent ? eventName : isNusantaraSky ? "ADVENTURE" : event.label || category).toUpperCase()}
                                    </span>
                                    <div className="event-archive-card-body">
                                        <h2>{eventName}</h2>
                                        <p className="event-archive-location">
                                            <MapPin size={12} aria-hidden="true" />
                                            <span>{event.lokasi}</span>
                                        </p>
                                        <p className="event-archive-description">{description}</p>
                                        <div className="event-archive-footer">
                                            <span>{event.produksi || sampleEvents[index % sampleEvents.length].produksi}</span>
                                            <Link
                                                to="/kontak"
                                                aria-label={t("eventConsultation", { name: eventName })}
                                                onClick={(clickEvent) => clickEvent.stopPropagation()}
                                                onKeyDown={(keyEvent) => keyEvent.stopPropagation()}
                                            >
                                                {t("viewDetails")}
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
                        aria-label={`${t("eventGallery")} ${selectedGallery.event.nama_event}`}
                        style={{ "--event-gallery-accent": selectedGallery.accent }}
                        onClick={(clickEvent) => clickEvent.stopPropagation()}
                    >
                        <header className="event-gallery-header">
                            <button
                                type="button"
                                className="event-gallery-back"
                                onClick={() => setSelectedGallery(null)}
                            >
                                <ChevronLeft size={16} aria-hidden="true" />
                                {t("back")}
                            </button>
                            <div className="event-gallery-heading">
                                <h2>{selectedGallery.event.nama_event}</h2>
                                <p><MapPin size={14} aria-hidden="true" /> {selectedGallery.event.lokasi}</p>
                            </div>
                            <span className="event-gallery-count">
                                {t("eventGallery")} · {selectedGallery.photos.length} {t("photos")}
                            </span>
                        </header>

                        <div className="event-gallery-layout">
                            <div className="event-gallery-feature">
                                <img
                                    src={selectedGallery.photos[activePhotoIndex]}
                                    alt={t("photoNumber", { name: selectedGallery.event.nama_event, number: activePhotoIndex + 1 })}
                                />
                                <span className="event-gallery-photo-index">
                                    {String(activePhotoIndex + 1).padStart(2, "0")} / {String(selectedGallery.photos.length).padStart(2, "0")}
                                </span>
                            </div>
                            {selectedGallery.photos.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        className="event-gallery-nav event-gallery-nav--previous"
                                        aria-label={t("previousPhoto")}
                                        onClick={() => setActivePhotoIndex((index) => (
                                            (index - 1 + selectedGallery.photos.length) % selectedGallery.photos.length
                                        ))}
                                    >
                                        <ChevronLeft size={24} aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        className="event-gallery-nav event-gallery-nav--next"
                                        aria-label={t("nextPhoto")}
                                        onClick={() => setActivePhotoIndex((index) => (
                                            (index + 1) % selectedGallery.photos.length
                                        ))}
                                    >
                                        <ChevronRight size={24} aria-hidden="true" />
                                    </button>
                                </>
                            )}
                            <div className="event-gallery-thumbnails" aria-label={t("otherPhotos")}>
                                {selectedGallery.photos.length > 1 && Array.from(
                                    { length: Math.min(3, selectedGallery.photos.length - 1) },
                                    (_, thumbnailIndex) => {
                                        const photoIndex = (activePhotoIndex + thumbnailIndex + 1) % selectedGallery.photos.length;

                                        return (
                                            <button
                                                type="button"
                                                className="event-gallery-thumbnail"
                                                key={`${selectedGallery.photos[photoIndex]}-${photoIndex}`}
                                                aria-label={t("showPhoto", { number: photoIndex + 1 })}
                                                onClick={() => setActivePhotoIndex(photoIndex)}
                                            >
                                                <img
                                                    src={selectedGallery.photos[photoIndex]}
                                                    alt=""
                                                />
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            )}

        </div>
    );
}

export default Event;