import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { buildUploadUrl } from "../services/media";
import { useLanguage } from "../contexts/LanguageContext";

function Galeri() {
    const { t } = useLanguage();

    const [galeri, setGaleri] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const getGaleri = async () => {

            try {

                const response = await api.get(
                    "/galeri/"
                );

                console.log(
                    "Galeri:",
                    response.data
                );

                if (response.data?.success) {
                    const galleryData = Array.isArray(response.data.data)
                        ? response.data.data
                        : [];

                    setGaleri(galleryData);

                } else {

                    setError(
                        response.data?.message ||
                        "Gagal mengambil data galeri"
                    );

                }

            } catch (error) {

                console.error(
                    "Galeri Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Tidak dapat terhubung ke server"
                );

            } finally {

                setLoading(false);

            }

        };

        getGaleri();

    }, []);

    const galleryItems = Array.isArray(galeri) ? galeri : [];

    return (

        <div className="page gallery-page">

            <section className="page-header">
                <div className="gallery-header-tags" aria-label={t("gallery")}>
                    <span>{t("photoGallery")}</span>
                    <span>{t("documentation")}</span>
                </div>
                <h1>{t("galleryHeaderTitle")}</h1>
                <p>{t("galleryHeaderDescription")}</p>
            </section>

            <section className="gallery-content">

                {loading && (
                    <p className="gallery-state" role="status">{t("loadingGallery")}</p>
                )}

                {!loading && error && (
                    <p className="gallery-state" role="alert">{error}</p>
                )}

                {!loading && (
                    <div className="gallery-grid">

                        {galleryItems.map((item) => {
                            const imageUrl = buildUploadUrl(item.gambar);
                            const imageAlt = item.judul || t("eventPhoto");

                            return (
                                <article className="gallery-photo-card" key={item.id ?? `${imageAlt}-${item.gambar}`}>
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={imageAlt}
                                            onError={(event) => {
                                                event.currentTarget.style.display = "none";
                                            }}
                                        />
                                    ) : null}
                                    <span className="gallery-photo-category">{item.kategori || t("eventPhoto")}</span>
                                    <div className="gallery-photo-caption">
                                        <h2>{item.judul || t("eventPhoto")}</h2>
                                        {item.deskripsi && <p>{item.deskripsi}</p>}
                                    </div>
                                </article>
                            );
                        })}

                        {Array.from(
                            { length: Math.max(0, 9 - galleryItems.length) },
                            (_, index) => {
                                const slotNumber = galleryItems.length + index + 1;

                                return (
                                    <Link
                                        to="/admin"
                                        className="gallery-photo-card gallery-photo-placeholder"
                                        key={`gallery-slot-${slotNumber}`}
                                        aria-label={t("addPhotoSlot", { number: slotNumber })}
                                    >
                                        <span className="gallery-placeholder-icon">
                                            <ImagePlus size={23} strokeWidth={1.7} aria-hidden="true" />
                                        </span>
                                        <strong>{t("photoSlot", { number: String(slotNumber).padStart(2, "0") })}</strong>
                                        <span className="gallery-placeholder-help">
                                            {t("addPhotoThroughAdmin")}
                                        </span>
                                    </Link>
                                );
                            }
                        )}

                    </div>
                )}

            </section>

        </div>

    );
}

export default Galeri;