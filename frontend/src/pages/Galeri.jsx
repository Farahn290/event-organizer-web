import { useEffect, useState } from "react";
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

            <section
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "60px 20px"
                }}
            >

                {loading && (

                    <p>
                        Memuat galeri...
                    </p>

                )}

                {!loading && error && (

                    <p>
                        {error}
                    </p>

                )}

                {!loading &&
                    !error &&
                    galeri.length === 0 && (

                        <p>
                            Belum ada dokumentasi galeri.
                        </p>

                    )}

                {!loading &&
                    !error &&
                    galeri.length > 0 && (

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(280px, 1fr))",
                                gap: "25px"
                            }}
                        >

                            {galeri.map((item) => (

                                <div
                                    key={item.id}
                                    style={{
                                        background: "#fff",
                                        border: "1px solid #ddd",
                                        overflow: "hidden"
                                    }}
                                >

                                    <img
                                        src={`http://localhost:8000/uploads/${item.gambar}`}
                                        alt={item.judul}
                                        style={{
                                            width: "100%",
                                            height: "220px",
                                            objectFit: "cover",
                                            display: "block"
                                        }}
                                    />

                                    <div
                                        style={{
                                            padding: "20px"
                                        }}
                                    >

                                        <h2>
                                            {item.judul}
                                        </h2>

                                        <p>
                                            {item.deskripsi}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

            </section>

        </div>

    );
}

export default Galeri;