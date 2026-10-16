import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import { ArrowRight } from "lucide-react";
import {
    categoryMeta,
    getServiceImage,
    moreServiceCard,
    sampleServices
} from "../data/serviceCatalog";

function Layanan() {
    const { t } = useLanguage();
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
                <p>{t("ourServices")}</p>
                <h1>{t("servicesTitle")}</h1>
                <span>{t("servicesIntro")}</span>
            </section>

            <section className="services-content" aria-label={t("serviceList")}>

                {loading && (
                    <p className="services-state" role="status">{t("loadingServices")}</p>
                )}

                {!loading && error && (
                    <p className="services-state" role="alert">{error}</p>
                )}

                {!loading &&
                    !error &&
                    layanan.length === 0 && (
                        <p className="services-state">{t("noServices")}</p>
                    )}

                {!loading &&
                    !error &&
                    layanan.length > 0 && (

                        <div className="services-grid">

                            {layanan.map((item, index) => {
                                const { label } = categoryMeta[index] || { label: "EVENT SERVICE" };

                                return (
                                    <article className="service-detail-card" key={item.id}>
                                        <div className="service-detail-image">
                                            <img
                                                src={getServiceImage(item, index)}
                                                alt={`Dokumentasi ${item.nama_layanan}`}
                                                loading="lazy"
                                            />
                                            <span className="service-detail-tag">{label}</span>
                                        </div>
                                        <h2>{item.nama_layanan}</h2>
                                        <p>{item.deskripsi}</p>
                                        <Link
                                            to={`/layanan/${encodeURIComponent(item.id)}`}
                                            state={{ service: item, index }}
                                            className="service-detail-link"
                                        >
                                            {t("viewDetails")} <ArrowRight size={13} aria-hidden="true" />
                                        </Link>
                                    </article>
                                );
                            })}

                            <article className="service-detail-card service-detail-card-more" key={moreServiceCard.id}>
                                <div className="service-detail-image">
                                    <img
                                        src={getServiceImage(moreServiceCard)}
                                        alt={`Dokumentasi ${moreServiceCard.nama_layanan}`}
                                        loading="lazy"
                                    />
                                    <span className="service-detail-tag">PUBLIC EVENT</span>
                                </div>
                                <h2>{moreServiceCard.nama_layanan}</h2>
                                <p>{moreServiceCard.deskripsi}</p>
                                <Link
                                    to={`/layanan/${encodeURIComponent(moreServiceCard.id)}`}
                                    state={{ service: moreServiceCard }}
                                    className="service-detail-link"
                                >
                                    {t("viewDetails")} <ArrowRight size={13} aria-hidden="true" />
                                </Link>
                            </article>

                        </div>

                    )}

            </section>

        </div>

    );
}

export default Layanan;