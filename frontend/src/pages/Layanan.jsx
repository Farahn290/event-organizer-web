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
    { label: "ACADEMIC", Icon: Presentation },
    { label: "ULTRA PRIVATE", Icon: Wine }
];

const sampleServices = [
    {
        id: "sample-wedding",
        nama_layanan: "Wedding Organizer",
        deskripsi: "Pernikahan impian dengan konsep elegan, intimate garden soiree maupun grand ballroom mewah. Koordinasi vendor menyeluruh, tata busana, hingga souvenir VIP."
    },
    {
        id: "sample-birthday",
        nama_layanan: "Birthday Party",
        deskripsi: "Pesta ulang tahun yang seru, tematik, dan penuh momen berkesan. Dari sweet seventeen gemerlap, 21st golden milestone, hingga jubilee private dinner."
    },
    {
        id: "sample-corporate",
        nama_layanan: "Corporate Event",
        deskripsi: "Acara perusahaan prestisius, product launch megah, annual meeting, awarding night, hingga company gathering dengan reputasi brand yang terjaga sempurna."
    },
    {
        id: "sample-concert",
        nama_layanan: "Concert & Festival",
        deskripsi: "Konser musik akbar dan festival meriah dengan sound-lighting berstandar internasional, rigging panggung kokoh, manajemen ticketing terintegrasi, dan keamanan ketat."
    },
    {
        id: "sample-seminar",
        nama_layanan: "Seminar & Workshop",
        deskripsi: "Pengelolaan seminar, international conference, dan symposium profesional berskala nasional. Dilengkapi live streaming hybrid multiroom dan registrasi digital."
    },
    {
        id: "sample-private",
        nama_layanan: "Private Event",
        deskripsi: "Acara privat eksklusif, VIP anniversary dinner, private yacht party, dan perayaan keluarga yang sarat keintiman serta privasi tanpa batas."
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

                    setLayanan(
                        response.data.data.length > 0
                            ? response.data.data
                            : sampleServices
                    );

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

                        </div>

                    )}

            </section>

        </div>

    );
}

export default Layanan;