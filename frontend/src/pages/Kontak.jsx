import { useState } from "react";
import {
    ArrowUpRight,
    Clock3,
    Mail,
    MapPin,
    MessageCircle,
    Send
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Kontak() {

    const [form, setForm] = useState({
        nama: "",
        email: "",
        no_hp: "",
        jenis_event: "",
        tanggal_event: "",
        budget: "",
        lokasi: "",
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

            const detailPesan = [
                form.jenis_event && `Jenis event: ${form.jenis_event}`,
                form.tanggal_event && `Estimasi tanggal: ${form.tanggal_event}`,
                form.budget && `Estimasi budget: ${form.budget}`,
                form.lokasi && `Lokasi / venue: ${form.lokasi}`,
                form.pesan && `Catatan konsep: ${form.pesan}`
            ].filter(Boolean).join("\n");

            const response = await api.post(
                "/kontak/create.php",
                {
                    nama: form.nama,
                    email: form.email,
                    no_hp: form.no_hp,
                    pesan: detailPesan
                }
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
                    jenis_event: "",
                    tanggal_event: "",
                    budget: "",
                    lokasi: "",
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
        <div className="page contact-page">
            <section className="contact-layout">
                <div className="contact-form-panel">
                    <p className="contact-kicker">RESERVE YOUR EVENT DATE</p>
                    <h1>Konsultasikan Acara Impian Anda</h1>
                    <p className="contact-intro-copy">
                        Isi formulir reservasi eksklusif di bawah ini. Tim kami akan menghubungi Anda dalam waktu 24 jam.
                    </p>

                    {message && <div className="contact-alert success" role="status">{message}</div>}
                    {error && <div className="contact-alert error" role="alert">{error}</div>}

                    <form className="contact-booking-form" onSubmit={handleSubmit}>
                        <label className="contact-field">
                            <span>FULL NAME</span>
                            <input
                                type="text"
                                name="nama"
                                value={form.nama}
                                onChange={handleChange}
                                placeholder="Nama lengkap"
                                autoComplete="name"
                                required
                            />
                        </label>

                        <label className="contact-field">
                            <span>EMAIL ADDRESS</span>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="nama@email.com"
                                autoComplete="email"
                                required
                            />
                        </label>

                        <label className="contact-field">
                            <span>PHONE / WHATSAPP</span>
                            <input
                                type="tel"
                                name="no_hp"
                                value={form.no_hp}
                                onChange={handleChange}
                                placeholder="+62 812-XXXX-XXXX"
                                autoComplete="tel"
                            />
                        </label>

                        <label className="contact-field">
                            <span>EVENT TYPE</span>
                            <select name="jenis_event" value={form.jenis_event} onChange={handleChange} required>
                                <option value="">Pilih jenis event...</option>
                                <option>Wedding</option>
                                <option>Corporate Event</option>
                                <option>Birthday Party</option>
                                <option>Concert &amp; Festival</option>
                                <option>Seminar &amp; Workshop</option>
                                <option>Private Event</option>
                                <option>Lainnya</option>
                            </select>
                        </label>

                        <label className="contact-field">
                            <span>ESTIMATED EVENT DATE</span>
                            <input
                                type="date"
                                name="tanggal_event"
                                value={form.tanggal_event}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="contact-field">
                            <span>ESTIMATED BUDGET</span>
                            <select name="budget" value={form.budget} onChange={handleChange}>
                                <option value="">Pilih estimasi budget...</option>
                                <option>Di bawah Rp25 juta</option>
                                <option>Rp25 juta - Rp75 juta</option>
                                <option>Rp75 juta - Rp150 juta</option>
                                <option>Di atas Rp150 juta</option>
                                <option>Diskusikan lebih lanjut</option>
                            </select>
                        </label>

                        <label className="contact-field full-width">
                            <span>PREFERRED LOCATION / VENUE</span>
                            <input
                                type="text"
                                name="lokasi"
                                value={form.lokasi}
                                onChange={handleChange}
                                placeholder="Contoh: ballroom hotel, outdoor venue, atau belum ada"
                            />
                        </label>

                        <label className="contact-field full-width">
                            <span>ADDITIONAL CONCEPT NOTES &amp; WISHES</span>
                            <textarea
                                name="pesan"
                                value={form.pesan}
                                onChange={handleChange}
                                placeholder="Ceritakan konsep impian Anda, jumlah tamu, atau kebutuhan khusus lainnya..."
                                rows="3"
                                required
                            />
                        </label>

                        <button className="contact-submit" type="submit" disabled={loading}>
                            <Send size={14} aria-hidden="true" />
                            {loading ? "MENGIRIM..." : "SUBMIT BOOKING REQUEST"}
                        </button>
                    </form>
                </div>

                <aside className="contact-sidebar">
                    <section className="contact-info-panel">
                        <h2>VIP Direct Contact</h2>
                        <p className="contact-sidebar-intro">
                            Untuk kebutuhan mendesak atau penjadwalan private pitching meeting secara tatap muka dengan tim Eventora.
                        </p>

                        <a className="contact-info-row" href="https://wa.me/6281234567890">
                            <span className="contact-info-icon"><MessageCircle size={15} aria-hidden="true" /></span>
                            <span><small>WHATSAPP DIRECT HOTLINE</small><strong>+62 812-3456-7890</strong><em>Respon cepat saat jam operasional</em></span>
                        </a>

                        <a className="contact-info-row" href="mailto:hello@eventora.com">
                            <span className="contact-info-icon"><Mail size={15} aria-hidden="true" /></span>
                            <span><small>OFFICIAL INQUIRY</small><strong>hello@eventora.com</strong><em>Proposal &amp; vendor partnership</em></span>
                        </a>

                        <div className="contact-info-row">
                            <span className="contact-info-icon"><MapPin size={15} aria-hidden="true" /></span>
                            <span><small>MAIN STUDIO OFFICE</small><strong>Jakarta, Indonesia</strong><em>Meeting by appointment</em></span>
                        </div>

                        <div className="contact-info-row">
                            <span className="contact-info-icon"><Clock3 size={15} aria-hidden="true" /></span>
                            <span><small>OPERATING HOURS</small><strong>Senin - Minggu</strong><em>09:00 - 21:00 WIB</em></span>
                        </div>

                        <div className="contact-social-row">
                            <span>SOCIAL SHOWCASE</span>
                            <Link to="/galeri">Lihat galeri <ArrowUpRight size={12} aria-hidden="true" /></Link>
                        </div>
                    </section>

                    <div className="contact-map-panel">
                        <iframe
                            title="Peta lokasi Eventora di Jakarta"
                            src="https://www.openstreetmap.org/export/embed.html?bbox=106.81%2C-6.23%2C106.88%2C-6.18&amp;layer=mapnik&amp;marker=-6.2088%2C106.8456"
                            loading="lazy"
                        />
                        <a
                            className="contact-map-label"
                            href="https://www.openstreetmap.org/?mlat=-6.2088&amp;mlon=106.8456#map=15/-6.2088/106.8456"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <MapPin size={13} aria-hidden="true" /> JAKARTA, INDONESIA
                        </a>
                    </div>
                </aside>
            </section>
        </div>

    );
}

export default Kontak;