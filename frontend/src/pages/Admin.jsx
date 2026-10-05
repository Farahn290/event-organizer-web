import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Admin() {

    const navigate = useNavigate();

    const [admin, setAdmin] = useState(null);

    // =========================
    // LAYANAN
    // =========================

    const [layanan, setLayanan] = useState([]);

    const [nama, setNama] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [editingId, setEditingId] = useState(null);

    // =========================
    // EVENT
    // =========================

    const [events, setEvents] = useState([]);

    const [namaEvent, setNamaEvent] = useState("");
    const [tanggal, setTanggal] = useState("");
    const [lokasi, setLokasi] = useState("");
    const [deskripsiEvent, setDeskripsiEvent] = useState("");

    const [editingEventId, setEditingEventId] = useState(null);

    // =========================
    // GALERI
    // =========================

    const [galeri, setGaleri] = useState([]);

    const [judulGaleri, setJudulGaleri] = useState("");
    const [gambarGaleri, setGambarGaleri] = useState(null);
    const [deskripsiGaleri, setDeskripsiGaleri] = useState("");

    const [editingGaleriId, setEditingGaleriId] = useState(null);
    const [gambarLama, setGambarLama] = useState("");

    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        const adminData = localStorage.getItem("admin");

        if (!adminData) {
            navigate("/login");
            return;
        }

        setAdmin(JSON.parse(adminData));

        getLayanan();
        getEvents();
        getGaleri();

    }, [navigate]);

    // =========================
    // GET LAYANAN
    // =========================

    const getLayanan = async () => {

        try {

            const response = await api.get("/layanan/");

            if (response.data.success) {

                setLayanan(response.data.data);

            }

        } catch (error) {

            console.error(
                "Gagal mengambil layanan:",
                error
            );

        }

    };

    // =========================
    // SUBMIT LAYANAN
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await api.put(
                    "/layanan/update.php",
                    {
                        id: editingId,
                        nama_layanan: nama,
                        deskripsi: deskripsi
                    }
                );

            } else {

                await api.post(
                    "/layanan/create.php",
                    {
                        nama_layanan: nama,
                        deskripsi: deskripsi
                    }
                );

            }

            setNama("");
            setDeskripsi("");
            setEditingId(null);

            getLayanan();

        } catch (error) {

            console.error(
                "Gagal menyimpan layanan:",
                error
            );

        }

    };

    // =========================
    // EDIT LAYANAN
    // =========================

    const handleEdit = (item) => {

        setEditingId(item.id);
        setNama(item.nama_layanan);
        setDeskripsi(item.deskripsi || "");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    // =========================
    // DELETE LAYANAN
    // =========================

    const handleDelete = async (id) => {

        if (!window.confirm(
            "Yakin ingin menghapus layanan ini?"
        )) {
            return;
        }

        try {

            await api.delete(
                "/layanan/delete.php",
                {
                    data: {
                        id: id
                    }
                }
            );

            getLayanan();

        } catch (error) {

            console.error(
                "Gagal menghapus layanan:",
                error
            );

        }

    };

    // =========================
    // GET EVENTS
    // =========================

    const getEvents = async () => {

        try {

            const response = await api.get(
                "/events/"
            );

            if (response.data.success) {

                setEvents(response.data.data);

            }

        } catch (error) {

            console.error(
                "Gagal mengambil event:",
                error
            );

        }

    };

    // =========================
    // SUBMIT EVENT
    // =========================

    const handleEventSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingEventId) {

                await api.put(
                    "/events/update.php",
                    {
                        id: editingEventId,
                        nama_event: namaEvent,
                        tanggal: tanggal,
                        lokasi: lokasi,
                        deskripsi: deskripsiEvent
                    }
                );

            } else {

                await api.post(
                    "/events/create.php",
                    {
                        nama_event: namaEvent,
                        tanggal: tanggal,
                        lokasi: lokasi,
                        deskripsi: deskripsiEvent
                    }
                );

            }

            setNamaEvent("");
            setTanggal("");
            setLokasi("");
            setDeskripsiEvent("");
            setEditingEventId(null);

            getEvents();

        } catch (error) {

            console.error(
                "Gagal menyimpan event:",
                error
            );

        }

    };

    // =========================
    // EDIT EVENT
    // =========================

    const handleEventEdit = (item) => {

        setEditingEventId(item.id);

        setNamaEvent(item.nama_event);
        setTanggal(item.tanggal);
        setLokasi(item.lokasi || "");
        setDeskripsiEvent(
            item.deskripsi || ""
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    // =========================
    // DELETE EVENT
    // =========================

    const handleEventDelete = async (id) => {

        if (!window.confirm(
            "Yakin ingin menghapus event ini?"
        )) {
            return;
        }

        try {

            await api.delete(
                "/events/delete.php",
                {
                    data: {
                        id: id
                    }
                }
            );

            getEvents();

        } catch (error) {

            console.error(
                "Gagal menghapus event:",
                error
            );

        }

    };

    // =========================
    // GET GALERI
    // =========================

    const getGaleri = async () => {

        try {

            const response = await api.get(
                "/galeri/"
            );

            console.log(
                "Galeri API:",
                response.data
            );

            if (response.data.success) {

                setGaleri(response.data.data);

            }

        } catch (error) {

            console.error(
                "Gagal mengambil galeri:",
                error
            );

        }

    };

    // =========================
    // SUBMIT GALERI
    // =========================

    const handleGaleriSubmit = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append(
                "judul",
                judulGaleri
            );

            formData.append(
                "deskripsi",
                deskripsiGaleri
            );

            if (gambarGaleri) {

                formData.append(
                    "gambar",
                    gambarGaleri
                );

            }

            if (editingGaleriId) {

                formData.append(
                    "id",
                    editingGaleriId
                );

                await api.post(
                    "/galeri/update.php",
                    formData
                );

            } else {

                await api.post(
                    "/galeri/create.php",
                    formData
                );

            }

            resetGaleriForm();

            getGaleri();

        } catch (error) {

            console.error(
                "Gagal menyimpan galeri:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Gagal menyimpan galeri"
            );

        }

    };

    // =========================
    // RESET GALERI
    // =========================

    const resetGaleriForm = () => {

        setJudulGaleri("");
        setGambarGaleri(null);
        setDeskripsiGaleri("");
        setEditingGaleriId(null);
        setGambarLama("");

        const input =
            document.getElementById(
                "gambarGaleri"
            );

        if (input) {
            input.value = "";
        }

    };

    // =========================
    // EDIT GALERI
    // =========================

    const handleGaleriEdit = (item) => {

        setEditingGaleriId(item.id);

        setJudulGaleri(
            item.judul
        );

        setDeskripsiGaleri(
            item.deskripsi || ""
        );

        setGambarLama(
            item.gambar || ""
        );

        setGambarGaleri(null);

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });

    };

    // =========================
    // DELETE GALERI
    // =========================

    const handleGaleriDelete = async (id) => {

        if (!window.confirm(
            "Yakin ingin menghapus galeri ini?"
        )) {
            return;
        }

        try {

            await api.post(
                "/galeri/delete.php",
                {
                    id: id
                }
            );

            getGaleri();

        } catch (error) {

            console.error(
                "Gagal menghapus galeri:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Gagal menghapus galeri"
            );

        }

    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("admin");

        navigate("/login");

    };

    // =========================
    // LOADING
    // =========================

    if (!admin) {

        return (
            <div
                style={{
                    padding: "50px",
                    textAlign: "center"
                }}
            >
                Memuat dashboard...
            </div>
        );

    }

    // =========================
    // RENDER
    // =========================

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f5f5f5",
                padding: "40px",
                fontFamily: "Arial"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto 40px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                <div>

                    <p
                        style={{
                            margin: 0,
                            color: "#777"
                        }}
                    >
                        ADMIN DASHBOARD
                    </p>

                    <img
                        src="/maqnet-kreasindo.svg"
                        alt="Maqnet Kreasindo"
                        className="admin-brand-image"
                    />

                    <span>
                        Selamat datang,{" "}
                        <strong>
                            {admin.nama}
                        </strong>
                    </span>

                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        padding: "12px 20px",
                        background: "#111",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>

            </div>

            {/* =========================
                LAYANAN
            ========================= */}

            <section
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto 40px",
                    background: "#fff",
                    padding: "30px",
                    boxSizing: "border-box"
                }}
            >

                <h2>
                    Kelola Layanan
                </h2>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "grid",
                        gap: "15px",
                        marginBottom: "30px"
                    }}
                >

                    <input
                        type="text"
                        placeholder="Nama layanan"
                        value={nama}
                        onChange={(e) =>
                            setNama(e.target.value)
                        }
                        required
                        style={{
                            padding: "12px"
                        }}
                    />

                    <textarea
                        placeholder="Deskripsi layanan"
                        value={deskripsi}
                        onChange={(e) =>
                            setDeskripsi(
                                e.target.value
                            )
                        }
                        rows="4"
                        style={{
                            padding: "12px"
                        }}
                    />

                    <div>

                        <button
                            type="submit"
                            style={{
                                padding: "12px 20px",
                                background: "#111",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            {editingId
                                ? "Update Layanan"
                                : "Tambah Layanan"}
                        </button>

                        {editingId && (

                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setNama("");
                                    setDeskripsi("");
                                }}
                                style={{
                                    marginLeft: "10px",
                                    padding: "12px 20px"
                                }}
                            >
                                Batal
                            </button>

                        )}

                    </div>

                </form>

                {layanan.map((item) => (

                    <div
                        key={item.id}
                        style={{
                            borderTop: "1px solid #ddd",
                            padding: "20px 0",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "20px"
                        }}
                    >

                        <div>

                            <h3>
                                {item.nama_layanan}
                            </h3>

                            <p>
                                {item.deskripsi}
                            </p>

                        </div>

                        <div>

                            <button
                                onClick={() =>
                                    handleEdit(item)
                                }
                                style={{
                                    marginRight: "10px",
                                    padding: "8px 15px"
                                }}
                            >
                                Edit
                            </button>

                            <button
                                onClick={() =>
                                    handleDelete(item.id)
                                }
                                style={{
                                    padding: "8px 15px",
                                    background: "#111",
                                    color: "#fff",
                                    border: "none"
                                }}
                            >
                                Hapus
                            </button>

                        </div>

                    </div>

                ))}

            </section>

            {/* =========================
                EVENT
            ========================= */}

            <section
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto 40px",
                    background: "#fff",
                    padding: "30px",
                    boxSizing: "border-box"
                }}
            >

                <h2>
                    Kelola Event
                </h2>

                <form
                    onSubmit={handleEventSubmit}
                    style={{
                        display: "grid",
                        gap: "15px",
                        marginBottom: "30px"
                    }}
                >

                    <input
                        type="text"
                        placeholder="Nama event"
                        value={namaEvent}
                        onChange={(e) =>
                            setNamaEvent(
                                e.target.value
                            )
                        }
                        required
                        style={{
                            padding: "12px"
                        }}
                    />

                    <input
                        type="date"
                        value={tanggal}
                        onChange={(e) =>
                            setTanggal(
                                e.target.value
                            )
                        }
                        required
                        style={{
                            padding: "12px"
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Lokasi event"
                        value={lokasi}
                        onChange={(e) =>
                            setLokasi(
                                e.target.value
                            )
                        }
                        style={{
                            padding: "12px"
                        }}
                    />

                    <textarea
                        placeholder="Deskripsi event"
                        value={deskripsiEvent}
                        onChange={(e) =>
                            setDeskripsiEvent(
                                e.target.value
                            )
                        }
                        rows="4"
                        style={{
                            padding: "12px"
                        }}
                    />

                    <div>

                        <button
                            type="submit"
                            style={{
                                padding: "12px 20px",
                                background: "#111",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            {editingEventId
                                ? "Update Event"
                                : "Tambah Event"}
                        </button>

                        {editingEventId && (

                            <button
                                type="button"
                                onClick={() => {

                                    setEditingEventId(null);
                                    setNamaEvent("");
                                    setTanggal("");
                                    setLokasi("");
                                    setDeskripsiEvent("");

                                }}
                                style={{
                                    marginLeft: "10px",
                                    padding: "12px 20px"
                                }}
                            >
                                Batal
                            </button>

                        )}

                    </div>

                </form>

                {events.map((item) => (

                    <div
                        key={item.id}
                        style={{
                            borderTop: "1px solid #ddd",
                            padding: "20px 0",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "20px"
                        }}
                    >

                        <div>

                            <h3>
                                {item.nama_event}
                            </h3>

                            <p>
                                Tanggal:{" "}
                                {item.tanggal}
                            </p>

                            <p>
                                Lokasi:{" "}
                                {item.lokasi}
                            </p>

                            <p>
                                {item.deskripsi}
                            </p>

                        </div>

                        <div>

                            <button
                                onClick={() =>
                                    handleEventEdit(item)
                                }
                                style={{
                                    marginRight: "10px",
                                    padding: "8px 15px"
                                }}
                            >
                                Edit
                            </button>

                            <button
                                onClick={() =>
                                    handleEventDelete(
                                        item.id
                                    )
                                }
                                style={{
                                    padding: "8px 15px",
                                    background: "#111",
                                    color: "#fff",
                                    border: "none"
                                }}
                            >
                                Hapus
                            </button>

                        </div>

                    </div>

                ))}

            </section>

            {/* =========================
                GALERI
            ========================= */}

            <section
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto 40px",
                    background: "#fff",
                    padding: "30px",
                    boxSizing: "border-box"
                }}
            >

                <h2>
                    Kelola Galeri
                </h2>

                <form
                    onSubmit={handleGaleriSubmit}
                    style={{
                        display: "grid",
                        gap: "15px",
                        marginBottom: "30px"
                    }}
                >

                    <input
                        type="text"
                        placeholder="Judul galeri"
                        value={judulGaleri}
                        onChange={(e) =>
                            setJudulGaleri(
                                e.target.value
                            )
                        }
                        required
                        style={{
                            padding: "12px"
                        }}
                    />

                    <input
                        id="gambarGaleri"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) =>
                            setGambarGaleri(
                                e.target.files[0]
                            )
                        }
                        style={{
                            padding: "10px"
                        }}
                    />

                    {editingGaleriId &&
                        gambarLama && (

                            <div>

                                <p>
                                    Gambar saat ini:
                                </p>

                                <img
                                    src={`http://localhost:8000/uploads/${gambarLama}`}
                                    alt="Gambar lama"
                                    style={{
                                        width: "200px",
                                        height: "120px",
                                        objectFit: "cover"
                                    }}
                                />

                            </div>

                        )}

                    <textarea
                        placeholder="Deskripsi galeri"
                        value={deskripsiGaleri}
                        onChange={(e) =>
                            setDeskripsiGaleri(
                                e.target.value
                            )
                        }
                        rows="4"
                        style={{
                            padding: "12px"
                        }}
                    />

                    <div>

                        <button
                            type="submit"
                            style={{
                                padding: "12px 20px",
                                background: "#111",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            {editingGaleriId
                                ? "Update Galeri"
                                : "Tambah Galeri"}
                        </button>

                        {editingGaleriId && (

                            <button
                                type="button"
                                onClick={
                                    resetGaleriForm
                                }
                                style={{
                                    marginLeft: "10px",
                                    padding: "12px 20px"
                                }}
                            >
                                Batal
                            </button>

                        )}

                    </div>

                </form>

                {galeri.length === 0 && (

                    <p>
                        Belum ada data galeri.
                    </p>

                )}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px"
                    }}
                >

                    {galeri.map((item) => (

                        <div
                            key={item.id}
                            style={{
                                border: "1px solid #ddd",
                                background: "#fff"
                            }}
                        >

                            <img
                                src={`http://localhost:8000/uploads/${item.gambar}`}
                                alt={item.judul}
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    objectFit: "cover",
                                    display: "block"
                                }}
                            />

                            <div
                                style={{
                                    padding: "15px"
                                }}
                            >

                                <h3>
                                    {item.judul}
                                </h3>

                                <p>
                                    {item.deskripsi}
                                </p>

                                <button
                                    onClick={() =>
                                        handleGaleriEdit(
                                            item
                                        )
                                    }
                                    style={{
                                        marginRight: "10px",
                                        padding: "8px 15px"
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleGaleriDelete(
                                            item.id
                                        )
                                    }
                                    style={{
                                        padding: "8px 15px",
                                        background: "#111",
                                        color: "#fff",
                                        border: "none"
                                    }}
                                >
                                    Hapus
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </section>

        </div>

    );

}

export default Admin;