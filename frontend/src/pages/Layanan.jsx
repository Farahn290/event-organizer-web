import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import layananFeatureImage from "../assets/layanan-feature.png";
import miceEventImage from "../assets/mice-event.png";
import brandActivationImage from "../assets/brand-activation.png";
import ceremonialEventImage from "../assets/ceremonial-event.png";
import musicEventImage from "../assets/music-event.png";
import publicEventImage from "../assets/public-event.png";
import {
    ArrowRight,
    Building2,
    CakeSlice,
    Heart,
    PartyPopper,
    Presentation,
    Sparkles
} from "lucide-react";

const categoryMeta = [
    { label: "BESPOKE", Icon: Heart },
    { label: "CELEBRATION", Icon: CakeSlice },
    { label: "CORPORATE", Icon: Building2 },
    { label: "MASS SCALE", Icon: PartyPopper },
    { label: "ACADEMIC", Icon: Presentation }
];

const serviceEventImages = [
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85"
];

const serviceImage = (item, index) => {
    if (!item.gambar) return serviceEventImages[index % serviceEventImages.length];
    return item.gambar.startsWith("http")
        ? item.gambar
        : `http://localhost:8000/uploads/${item.gambar}`;
};

const moreServiceCard = {
    id: "sample-more",
    nama_layanan: "GOOVERMENT & PUBLIC EVENT",
    deskripsi: "penyelenggaraan acara kenegaraan dan festival publik yang aman, tertib, dan berdampak luas. Dilengkapi manajemen kerumunan (crowd control), koordinasi lintas instansi, serta tata protokoler resmi."
};

const sampleServices = [
    {
        id: "sample-wedding",
        nama_layanan: "CORPORATE EVENT",
        deskripsi: "Solusi acara bisnis eksklusif untuk peluncuran produk, corporate gathering, maupun awarding night berkelas. Pengelolaan end-to-end mencakup konsep tematik, stage design, pengisi acara ternama, hingga cinderamata VIP."
    },
    {
        id: "sample-birthday",
        nama_layanan: "MICE EVENT",
        deskripsi: "Layanan komprehensif penyelenggaraan konferensi, seminar korporat, pameran akbar, hingga program insentif perjalanan. Didukung teknologi mutakhir, koordinasi logistik terpadu, dan manajemen peserta profesional."
    },
    {
        id: "sample-corporate",
        nama_layanan: "BRAND ACTIVATION",
        deskripsi: "Menghidupkan identitas brand Anda melalui kampanye kreatif, peluncuran produk tematik, dan aksi langsung yang memikat. Dirancang untuk menciptakan impresi kuat, interaksi organik, serta eksposur maksimal."
    },
    {
        id: "sample-concert",
        nama_layanan: "CEREMONIAL EVENTS",
        deskripsi: "Solusi profesional untuk perhelatan seremonial resmi berstandar tinggi. Menangani grand opening, awarding resmi, dan momen perayaan penting dengan tata visual canggih, alur protokoler rapi, serta koordinasi tanpa cela."
    },
    {
        id: "sample-seminar",
        nama_layanan: "MUSIC EVENT",
        deskripsi: "Rasakan energi konser live yang tak terlupakan. Kami mengelola segala aspek untuk perhelatan musik Anda: manajemen tiket yang efisien, penyediaan peralatan panggung berstandar tinggi, tata pencahayaan spektakuler, hingga sistem keamanan yang ketat."
    }
];

function Layanan() {
    const [layanan, setLayanan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const getLayanan = async () => {

            try {

                const response = await api.get(
                    "/layanan/"
                );

                console.log(
                    "Layanan API:",
                    response.data
                );

                if (response.data.success) {

                    const services = response.data.data.length > 0
                        ? response.data.data
                        : sampleServices;

                    setLayanan(services.slice(0, 5));

                } else {

                    setError(
                        response.data.message ||
                        "Gagal mengambil data layanan"
                    );

                }

            } catch (error) {

                console.error(
                    "Layanan Error:",
                    error
                );

                setLayanan(sampleServices);

            } finally {

                setLoading(false);

            }

        };

        getLayanan();

    }, []);

    return (

        <div className="page services-page">

            <section className="services-intro">
                <p>WHAT WE SPECIALIZE IN</p>
                <h1>Our Specialized <span className="services-title-highlight">Services</span></h1>
                <span>
                    Solusi komprehensif untuk setiap jenis perayaan dan acara penting Anda,
                    dirancang dengan dedikasi artistik dan eksekusi teknis tingkat tinggi.
                </span>
            </section>

            <section className="services-content" aria-label="Daftar layanan Eventora">

                {loading && (
                    <p className="services-state" role="status">Memuat layanan...</p>
                )}

                {!loading && error && (
                    <p className="services-state" role="alert">{error}</p>
                )}

                {!loading &&
                    !error &&
                    layanan.length === 0 && (
                        <p className="services-state">Belum ada layanan.</p>
                    )}

                {!loading &&
                    !error &&
                    layanan.length > 0 && (

                        <div className="services-grid">

                            {layanan.map((item, index) => {
                                const { label, Icon } = categoryMeta[index] || {
                                    label: "EVENT SERVICE",
                                    Icon: Sparkles
                                };
                                const isCorporateEvent =
                                    item.nama_layanan.trim().toLowerCase() === "corporate event";
                                const isMiceEvent =
                                    item.nama_layanan.trim().toLowerCase() === "mice event";
                                const isBrandActivation =
                                    item.nama_layanan.trim().toLowerCase() === "brand activation";
                                const isCeremonialEvent =
                                    item.nama_layanan.trim().toLowerCase() === "ceremonial events";
                                const isMusicEvent =
                                    item.nama_layanan.trim().toLowerCase() === "music event";

                                return (
                                    <article className="service-detail-card" key={item.id}>
                                        <div className="service-detail-image">
                                            <img
                                                src={isMusicEvent
                                                    ? musicEventImage
                                                    : isCeremonialEvent
                                                        ? layananFeatureImage
                                                        : isBrandActivation
                                                            ? brandActivationImage
                                                            : isMiceEvent
                                                                ? miceEventImage
                                                                : isCorporateEvent
                                                                    ? ceremonialEventImage
                                                                    : serviceImage(item, index)}
                                                alt={`Dokumentasi ${item.nama_layanan}`}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="service-detail-meta">
                                            <span className="service-detail-icon">
                                                <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                                            </span>
                                            <span className="service-detail-tag">{label}</span>
                                        </div>
                                        <h2>{item.nama_layanan}</h2>
                                        <p>{item.deskripsi}</p>
                                        <Link to="/kontak" className="service-detail-link">
                                            VIEW DETAILS <ArrowRight size={13} aria-hidden="true" />
                                        </Link>
                                    </article>
                                );
                            })}

                            <article className="service-detail-card service-detail-card-more" key={moreServiceCard.id}>
                                <div className="service-detail-image">
                                    <img
                                        src={publicEventImage}
                                        alt={`Dokumentasi ${moreServiceCard.nama_layanan}`}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="service-detail-meta">
                                    <span className="service-detail-icon">
                                        <Sparkles size={17} strokeWidth={1.8} aria-hidden="true" />
                                    </span>
                                    <span className="service-detail-tag">MORE</span>
                                </div>
                                <h2>{moreServiceCard.nama_layanan}</h2>
                                <p>{moreServiceCard.deskripsi}</p>
                                <Link to="/kontak" className="service-detail-link">
                                    VIEW DETAILS <ArrowRight size={13} aria-hidden="true" />
                                </Link>
                            </article>

                        </div>

                    )}

            </section>

        </div>

    );
}

export default Layanan;