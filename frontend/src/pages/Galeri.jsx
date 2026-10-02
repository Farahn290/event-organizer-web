import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Galeri() {

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

                if (response.data.success) {

                    setGaleri(
                        response.data.data
                    );

                } else {

                    setError(
                        response.data.message ||
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

    return (

        <div className="page">

            <section className="page-header">

                <p>
                    OUR WORK
                </p>

                <h1>
                    Galeri
                </h1>

                <span>
                    Dokumentasi acara yang kami selenggarakan.
                </span>

            </section>

            <section className="gallery-content">

                {loading && (
                    <p className="gallery-state" role="status">Memuat galeri...</p>
                )}

                {!loading && error && (
                    <p className="gallery-state" role="alert">{error}</p>
                )}

                {!loading && (
                    <div className="gallery-grid">

                        {galeri.map((item) => (
                            <article className="gallery-photo-card" key={item.id}>
                                <img
                                    src={`http://localhost:8000/uploads/${item.gambar}`}
                                    alt={item.judul}
                                />
                                <div className="gallery-photo-caption">
                                    <h2>{item.judul}</h2>
                                    {item.deskripsi && <p>{item.deskripsi}</p>}
                                </div>
                            </article>
                        ))}

                        {Array.from(
                            { length: Math.max(0, 9 - galeri.length) },
                            (_, index) => {
                                const slotNumber = galeri.length + index + 1;

                                return (
                                    <Link
                                        to="/admin"
                                        className="gallery-upload-slot"
                                        key={`gallery-slot-${slotNumber}`}
                                        aria-label={`Tambah foto event ke slot ${slotNumber} melalui Admin`}
                                    >
                                        <span className="gallery-upload-icon">
                                            <ImagePlus size={25} strokeWidth={1.5} aria-hidden="true" />
                                        </span>
                                        <strong>Slot foto {String(slotNumber).padStart(2, "0")}</strong>
                                        <span>Tambah foto event melalui Admin</span>
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