import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
    ArrowRight,
    Building2,
    CakeSlice,
    Heart,
    PartyPopper,
    Presentation,
    Sparkles,
    Wine
} from "lucide-react";

const categoryMeta = [
    { label: "BESPOKE", Icon: Heart },
    { label: "CELEBRATION", Icon: CakeSlice },
    { label: "CORPORATE", Icon: Building2 },
    { label: "MASS SCALE", Icon: PartyPopper },
    { label: "ACADEMIC", Icon: Presentation }
];

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
        nama_layanan: "SEMINAR WORKSHOP",
        deskripsi: "Sukseskan program pelatihan dan lokakarya Anda tanpa repot. Kami menangani manajemen pendaftaran peserta, penyediaan kit seminar eksklusif, tata ruang kelas ergonomis, hingga teknologi live feedback interaktif."
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

        <div className="page">

            <section className="services-intro">
                <p>WHAT WE SPECIALIZE IN</p>
                <h1>Our Specialized Services</h1>
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

                                return (
                                    <article className="service-detail-card" key={item.id}>
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