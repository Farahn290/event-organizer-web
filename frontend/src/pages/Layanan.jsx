import { useEffect, useState } from "react";
import api from "../services/api";

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
                        response.data.data
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

                setError(
                    error.response?.data?.message ||
                    "Tidak dapat terhubung ke server"
                );

            } finally {

                setLoading(false);

            }

        };

        getLayanan();

    }, []);

    return (

        <div className="page">

            {/* HEADER */}

            <section className="page-header">

                <p>
                    OUR SERVICES
                </p>

                <h1>
                    Layanan
                </h1>

                <span>
                    Solusi profesional untuk berbagai kebutuhan acara Anda.
                </span>

            </section>

            {/* CONTENT */}

            <section
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "60px 20px"
                }}
            >

                {loading && (

                    <p>
                        Memuat layanan...
                    </p>

                )}

                {!loading && error && (

                    <p>
                        {error}
                    </p>

                )}

                {!loading &&
                    !error &&
                    layanan.length === 0 && (

                        <p>
                            Belum ada layanan.
                        </p>

                    )}

                {!loading &&
                    !error &&
                    layanan.length > 0 && (

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(280px, 1fr))",
                                gap: "25px"
                            }}
                        >

                            {layanan.map((item) => (

                                <div
                                    key={item.id}
                                    style={{
                                        padding: "30px",
                                        background: "#fff",
                                        border: "1px solid #ddd",
                                        minHeight: "220px",
                                        boxSizing: "border-box"
                                    }}
                                >

                                    <p
                                        style={{
                                            fontSize: "14px",
                                            letterSpacing: "2px",
                                            color: "#777"
                                        }}
                                    >
                                        SERVICE
                                    </p>

                                    <h2>
                                        {item.nama_layanan}
                                    </h2>

                                    <p
                                        style={{
                                            lineHeight: "1.7",
                                            color: "#555"
                                        }}
                                    >
                                        {item.deskripsi}
                                    </p>

                                </div>

                            ))}

                        </div>

                    )}

            </section>

        </div>

    );
}

export default Layanan;