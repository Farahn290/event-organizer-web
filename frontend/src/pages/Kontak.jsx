import { useState } from "react";
import api from "../services/api";

function Kontak() {

    const [form, setForm] = useState({
        nama: "",
        email: "",
        no_hp: "",
        pesan: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {

            const response = await api.post(
                "/kontak/create.php",
                form
            );

            console.log(
                "Kontak API:",
                response.data
            );

            if (response.data.success) {

                setMessage(
                    "Pesan berhasil dikirim. Kami akan segera menghubungi Anda."
                );

                setForm({
                    nama: "",
                    email: "",
                    no_hp: "",
                    pesan: ""
                });

            } else {

                setError(
                    response.data.message ||
                    "Gagal mengirim pesan"
                );

            }

        } catch (error) {

            console.error(
                "Kontak Error:",
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

    return (

        <div className="page">

            <section className="page-header">

                <p>
                    CONTACT US
                </p>

                <h1>
                    Hubungi Kami
                </h1>

                <span>
                    Konsultasikan kebutuhan event Anda bersama tim kami.
                </span>

            </section>


            <section
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "60px 20px"
                }}
            >

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1.5fr",
                        gap: "50px",
                        alignItems: "start"
                    }}
                >

                    <div>

                        <p
                            style={{
                                fontSize: "14px",
                                letterSpacing: "2px",
                                color: "#777"
                            }}
                        >
                            LET'S TALK
                        </p>

                        <h2
                            style={{
                                fontSize: "36px",
                                marginBottom: "20px"
                            }}
                        >
                            Mari Wujudkan
                            <br />
                            Event Impian Anda
                        </h2>

                        <p
                            style={{
                                lineHeight: "1.8",
                                color: "#555"
                            }}
                        >
                            Ceritakan kebutuhan acara Anda kepada
                            kami. Tim Eventora siap membantu
                            merencanakan dan mengelola event
                            sesuai kebutuhan Anda.
                        </p>

                        <div
                            style={{
                                marginTop: "35px"
                            }}
                        >

                            <p>
                                <strong>Email</strong>
                                <br />
                                hello@eventora.com
                            </p>

                            <p>
                                <strong>Telepon</strong>
                                <br />
                                +62 812-3456-7890
                            </p>

                            <p>
                                <strong>Alamat</strong>
                                <br />
                                Jakarta, Indonesia
                            </p>

                        </div>

                    </div>


                    <div
                        style={{
                            border: "1px solid #ddd",
                            padding: "35px",
                            background: "#fff"
                        }}
                    >

                        <h2>
                            Kirim Pesan
                        </h2>

                        <p
                            style={{
                                color: "#777",
                                marginBottom: "25px"
                            }}
                        >
                            Isi form berikut untuk menghubungi
                            tim kami.
                        </p>


                        {message && (

                            <div
                                style={{
                                    padding: "15px",
                                    marginBottom: "20px",
                                    background: "#e8f5e9",
                                    color: "#2e7d32"
                                }}
                            >
                                {message}
                            </div>

                        )}


                        {error && (

                            <div
                                style={{
                                    padding: "15px",
                                    marginBottom: "20px",
                                    background: "#ffebee",
                                    color: "#c62828"
                                }}
                            >
                                {error}
                            </div>

                        )}


                        <form onSubmit={handleSubmit}>

                            <div
                                style={{
                                    marginBottom: "20px"
                                }}
                            >

                                <label>
                                    Nama
                                </label>

                                <input
                                    type="text"
                                    name="nama"
                                    value={form.nama}
                                    onChange={handleChange}
                                    placeholder="Nama lengkap"
                                    required
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "13px",
                                        marginTop: "8px",
                                        boxSizing: "border-box"
                                    }}
                                />

                            </div>


                            <div
                                style={{
                                    marginBottom: "20px"
                                }}
                            >

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="nama@email.com"
                                    required
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "13px",
                                        marginTop: "8px",
                                        boxSizing: "border-box"
                                    }}
                                />

                            </div>


                            <div
                                style={{
                                    marginBottom: "20px"
                                }}
                            >

                                <label>
                                    Nomor HP
                                </label>

                                <input
                                    type="text"
                                    name="no_hp"
                                    value={form.no_hp}
                                    onChange={handleChange}
                                    placeholder="08xxxxxxxxxx"
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "13px",
                                        marginTop: "8px",
                                        boxSizing: "border-box"
                                    }}
                                />

                            </div>


                            <div
                                style={{
                                    marginBottom: "25px"
                                }}
                            >

                                <label>
                                    Pesan
                                </label>

                                <textarea
                                    name="pesan"
                                    value={form.pesan}
                                    onChange={handleChange}
                                    placeholder="Ceritakan kebutuhan event Anda..."
                                    required
                                    rows="6"
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "13px",
                                        marginTop: "8px",
                                        boxSizing: "border-box",
                                        resize: "vertical"
                                    }}
                                />

                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "15px",
                                    background: "#111",
                                    color: "#fff",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "15px"
                                }}
                            >
                                {loading
                                    ? "MENGIRIM..."
                                    : "KIRIM PESAN"
                                }
                            </button>

                        </form>

                    </div>

                </div>

            </section>

        </div>

    );
}

export default Kontak;