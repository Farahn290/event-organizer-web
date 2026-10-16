import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import {
    getServiceAccent,
    getServiceImage,
    moreServiceCard,
    sampleServices
} from "../data/serviceCatalog";

function LayananDetail() {
    const { t } = useLanguage();
    const { id } = useParams();
    const location = useLocation();
    const routeService = location.state?.service;
    const routeIndex = location.state?.index ?? 0;
    const [service, setService] = useState(routeService || null);
    const [serviceIndex, setServiceIndex] = useState(routeIndex);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(!routeService);

    useEffect(() => {
        let active = true;

        const getService = async () => {
            const sampleService = id === moreServiceCard.id
                ? moreServiceCard
                : sampleServices.find((item) => String(item.id) === id);

            if (sampleService) {
                setService(sampleService);
                setServiceIndex(sampleServices.findIndex((item) => item.id === sampleService.id));
                setError("");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/layanan/");
                const services = response.data.success ? response.data.data : [];
                const servicePosition = services.findIndex((item) => String(item.id) === id);

                if (!active) return;

                if (servicePosition >= 0) {
                    setService(services[servicePosition]);
                    setServiceIndex(servicePosition);
                    setError("");
                } else if (routeService && String(routeService.id) === id) {
                    setService(routeService);
                    setServiceIndex(routeIndex);
                    setError("");
                } else {
                    setService(null);
                    setError(response.data.message || "Layanan tidak ditemukan.");
                }
            } catch (requestError) {
                console.error("Gagal mengambil detail layanan:", requestError);

                if (!active) return;

                if (routeService && String(routeService.id) === id) {
                    setService(routeService);
                    setServiceIndex(routeIndex);
                    setError("");
                } else {
                    setService(null);
                    setError("Detail layanan tidak dapat dimuat. Periksa koneksi server lalu coba lagi.");
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        getService();

        return () => {
            active = false;
        };
    }, [id, routeIndex, routeService]);

    if (loading) {
        return (
            <main className="page service-detail-page">
                <p className="service-detail-state" role="status">{t("loadingServicesDetail")}</p>
            </main>
        );
    }

    if (error || !service) {
        return (
            <main className="page service-detail-page">
                <section className="service-detail-message">
                    <p className="service-detail-eyebrow">{t("serviceDetail")}</p>
                    <h1>{error || t("serviceNotFound")}</h1>
                    <Link to="/layanan" className="service-detail-back">
                        <ArrowLeft size={16} aria-hidden="true" />
                        {t("backToServices")}
                    </Link>
                </section>
            </main>
        );
    }

    const image = getServiceImage(service, Math.max(serviceIndex, 0));
    const accent = getServiceAccent(service, Math.max(serviceIndex, 0));
    const paragraphs = (service.deskripsi || "Informasi layanan akan segera tersedia.")
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    return (
        <main className={`page service-detail-page service-detail-page--${accent}`}>
            <section className="service-detail-hero">
                <div className="service-detail-copy">
                    <Link to="/layanan" className="service-detail-back">
                        <ArrowLeft size={16} aria-hidden="true" />
                        {t("allServices")}
                    </Link>
                    <p className="service-detail-eyebrow">
                        <Sparkles size={14} aria-hidden="true" />
                        LAYANAN KAMI
                    </p>
                    <h1>{service.nama_layanan}</h1>
                    <div className="service-detail-description">
                        {(paragraphs.length > 0 ? paragraphs : [t("serviceInfoUnavailable")]).map((paragraph, index) => (
                            <p key={`${index}-${paragraph}`}>{paragraph}</p>
                        ))}
                    </div>
                    <Link to="/kontak" className="service-detail-cta">
                        {t("consultService")}
                        <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                </div>
                <figure className="service-detail-visual">
                    <img src={image} alt={`Dokumentasi ${service.nama_layanan}`} />
                    <figcaption>{service.nama_layanan}</figcaption>
                </figure>
            </section>
        </main>
    );
}

export default LayananDetail;
