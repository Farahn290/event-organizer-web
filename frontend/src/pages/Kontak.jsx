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
import { useLanguage } from "../contexts/LanguageContext";

function Kontak() {
    const { t, language } = useLanguage();

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

            const budgetLabels = {
                "under-25m": t("under25m"),
                "25m-75m": t("budget25to75"),
                "75m-150m": t("budget75to150"),
                "over-150m": t("over150m"),
                discuss: t("discussBudget")
            };

            const detailPesan = [
                form.jenis_event && `${language === "en" ? "Event type" : "Jenis event"}: ${form.jenis_event}`,
                form.tanggal_event && `${language === "en" ? "Estimated date" : "Estimasi tanggal"}: ${form.tanggal_event}`,
                form.budget && `${language === "en" ? "Estimated budget" : "Estimasi budget"}: ${budgetLabels[form.budget] || form.budget}`,
                form.lokasi && `${language === "en" ? "Preferred location / venue" : "Lokasi / venue"}: ${form.lokasi}`,
                form.pesan && `${language === "en" ? "Concept notes" : "Catatan konsep"}: ${form.pesan}`
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
                    t("messageSent")
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
                    t("failedMessage")
                );

            }

        } catch (error) {

            console.error(
                "Kontak Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                t("cannotConnect")
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="page contact-page">
            <section className="contact-layout">
                <div className="contact-form-panel">
                    <p className="contact-kicker">{t("reserveDate")}</p>
                    <h1>{t("contactTitle")}</h1>
                    <p className="contact-intro-copy">{t("contactIntro")}</p>

                    {message && <div className="contact-alert success" role="status">{message}</div>}
                    {error && <div className="contact-alert error" role="alert">{error}</div>}

                    <form className="contact-booking-form" onSubmit={handleSubmit}>
                        <label className="contact-field">
                            <span>{t("fullName")}</span>
                            <input
                                type="text"
                                name="nama"
                                value={form.nama}
                                onChange={handleChange}
                                placeholder={t("fullNamePlaceholder")}
                                autoComplete="name"
                                required
                            />
                        </label>

                        <label className="contact-field">
                            <span>{t("emailAddress")}</span>
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
                            <span>{t("phoneWhatsapp")}</span>
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
                            <span>{t("eventType")}</span>
                            <select name="jenis_event" value={form.jenis_event} onChange={handleChange} required>
                                <option value="">{t("chooseEventType")}</option>
                                <option value="Wedding">{t("wedding")}</option>
                                <option value="Corporate Event">{t("corporateEvent")}</option>
                                <option value="Birthday Party">{t("birthdayParty")}</option>
                                <option value="Concert & Festival">{t("concertFestival")}</option>
                                <option value="Seminar & Workshop">{t("seminarWorkshop")}</option>
                                <option value="Private Event">{t("privateEvent")}</option>
                                <option value="Other">{t("other")}</option>
                            </select>
                        </label>

                        <label className="contact-field">
                            <span>{t("estimatedDate")}</span>
                            <input
                                type="date"
                                name="tanggal_event"
                                value={form.tanggal_event}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="contact-field">
                            <span>{t("estimatedBudget")}</span>
                            <select name="budget" value={form.budget} onChange={handleChange}>
                                <option value="">{t("chooseBudget")}</option>
                                <option value="under-25m">{t("under25m")}</option>
                                <option value="25m-75m">{t("budget25to75")}</option>
                                <option value="75m-150m">{t("budget75to150")}</option>
                                <option value="over-150m">{t("over150m")}</option>
                                <option value="discuss">{t("discussBudget")}</option>
                            </select>
                        </label>

                        <label className="contact-field full-width">
                            <span>{t("preferredVenue")}</span>
                            <input
                                type="text"
                                name="lokasi"
                                value={form.lokasi}
                                onChange={handleChange}
                                placeholder={t("venuePlaceholder")}
                            />
                        </label>

                        <label className="contact-field full-width">
                            <span>{t("conceptNotes")}</span>
                            <textarea
                                name="pesan"
                                value={form.pesan}
                                onChange={handleChange}
                                placeholder={t("conceptPlaceholder")}
                                rows="3"
                                required
                            />
                        </label>

                        <button className="contact-submit" type="submit" disabled={loading}>
                            <Send size={14} aria-hidden="true" />
                            {loading ? t("sending") : t("submitRequest")}
                        </button>
                    </form>
                </div>

                <aside className="contact-sidebar">
                    <section className="contact-info-panel">
                        <h2>{t("vipContact")}</h2>
                        <p className="contact-sidebar-intro">{t("urgentContact")}</p>

                        <a className="contact-info-row" href="https://wa.me/6281234567890">
                            <span className="contact-info-icon"><MessageCircle size={15} aria-hidden="true" /></span>
                            <span><small>{t("whatsappHotline")}</small><strong>+62 812-3456-7890</strong><em>{t("quickResponse")}</em></span>
                        </a>

                        <a className="contact-info-row" href="mailto:hello@eventora.com">
                            <span className="contact-info-icon"><Mail size={15} aria-hidden="true" /></span>
                            <span><small>{t("officialInquiry")}</small><strong>hello@eventora.com</strong><em>{t("proposalPartner")}</em></span>
                        </a>

                        <div className="contact-info-row">
                            <span className="contact-info-icon"><MapPin size={15} aria-hidden="true" /></span>
                            <span><small>{t("mainStudio")}</small><strong>{t("jakarta")}</strong><em>{t("meetingByAppointment")}</em></span>
                        </div>

                        <div className="contact-info-row">
                            <span className="contact-info-icon"><Clock3 size={15} aria-hidden="true" /></span>
                            <span><small>{t("operatingHours")}</small><strong>{t("mondaySunday")}</strong><em>09:00 - 21:00 WIB</em></span>
                        </div>

                        <div className="contact-social-row">
                            <span>{t("socialShowcase")}</span>
                            <Link to="/galeri">{t("seeGallery")} <ArrowUpRight size={12} aria-hidden="true" /></Link>
                        </div>
                    </section>

                    <div className="contact-map-panel">
                        <iframe
                            title={t("jakarta")}
                            src="https://www.openstreetmap.org/export/embed.html?bbox=106.81%2C-6.23%2C106.88%2C-6.18&amp;layer=mapnik&amp;marker=-6.2088%2C106.8456"
                            loading="lazy"
                        />
                        <a
                            className="contact-map-label"
                            href="https://www.openstreetmap.org/?mlat=-6.2088&amp;mlon=106.8456#map=15/-6.2088/106.8456"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <MapPin size={13} aria-hidden="true" /> {t("jakartaIndonesia")}
                        </a>
                    </div>
                </aside>
            </section>
        </div>

    );
}

export default Kontak;