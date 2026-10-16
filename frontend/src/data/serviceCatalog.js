import layananFeatureImage from "../assets/layanan-feature.png";
import miceEventImage from "../assets/mice-event.png";
import brandActivationImage from "../assets/brand-activation.png";
import ceremonialEventImage from "../assets/ceremonial-event.png";
import musicEventImage from "../assets/music-event.png";
import publicEventImage from "../assets/public-event.png";

export const categoryMeta = [
    { label: "BESPOKE" },
    { label: "PROFESSIONAL" },
    { label: "CREATIVE" },
    { label: "CEREMONIAL" },
    { label: "LIVE MUSIC" }
];

const serviceEventImages = [
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85"
];

export const getServiceImage = (item, index = 0) => {
    const name = (item.nama_layanan || "").trim().toLowerCase();

    if (item.id === "sample-more") return publicEventImage;
    if (name === "music event") return musicEventImage;
    if (name === "ceremonial events") return layananFeatureImage;
    if (name === "brand activation") return brandActivationImage;
    if (name === "mice event") return miceEventImage;
    if (name === "corporate event") return ceremonialEventImage;

    if (item.gambar) {
        if (item.gambar.startsWith("http") || item.gambar.startsWith("/")) {
            return item.gambar;
        }

        return `http://localhost:8000/uploads/${item.gambar}`;
    }

    return serviceEventImages[index % serviceEventImages.length];
};

export const getServiceAccent = (item, index = 0) => {
    const name = (item.nama_layanan || "").trim().toLowerCase();

    if (name === "brand activation") return "cyan";
    if (name === "mice event") return "blue";
    if (name === "ceremonial events") return "gold";
    if (name === "corporate event") return "orange";
    if (name === "music event") return "violet";
    if (item.id === moreServiceCard.id || name.includes("public")) return "teal";

    return ["cyan", "blue", "gold", "orange", "violet", "teal"][index % 6];
};

export const moreServiceCard = {
    id: "sample-more",
    nama_layanan: "GOVERNMENT & PUBLIC EVENT",
    deskripsi: "Penyelenggaraan acara kenegaraan dan festival publik yang aman, tertib, dan berdampak luas. Dilengkapi manajemen kerumunan (crowd control), koordinasi lintas instansi, serta tata protokoler resmi."
};

export const sampleServices = [
    {
        id: "sample-wedding",
        nama_layanan: "CORPORATE EVENT",
        deskripsi: "Solusi acara bisnis eksklusif untuk peluncuran produk, corporate gathering, maupun awarding night berkelas. Pengelolaan end-to-end mencakup konsep tematik, stage design, pengisi acara ternama, hingga cinderamata VIP."
    },
    {
        id: "sample-birthday",
        nama_layanan: "MICE EVENT",
        deskripsi: "Layanan komprehensif penyelenggaraan konferensi, seminar korporat, pameran akbar, hingga program insentif perjalanan. Didukung teknologi mutakhir, koordinasi logistik terpadu, dan manajemen peserta profesional."
    },
    {
        id: "sample-corporate",
        nama_layanan: "BRAND ACTIVATION",
        deskripsi: "Menghidupkan identitas brand Anda melalui kampanye kreatif, peluncuran produk tematik, dan aksi langsung yang memikat. Dirancang untuk menciptakan impresi kuat, interaksi organik, serta eksposur maksimal."
    },
    {
        id: "sample-concert",
        nama_layanan: "CEREMONIAL EVENTS",
        deskripsi: "Solusi profesional untuk perhelatan seremonial resmi berstandar tinggi. Menangani grand opening, awarding resmi, dan momen perayaan penting dengan tata visual canggih, alur protokoler rapi, serta koordinasi tanpa cela."
    },
    {
        id: "sample-seminar",
        nama_layanan: "MUSIC EVENT",
        deskripsi: "Rasakan energi konser live yang tak terlupakan. Kami mengelola segala aspek untuk perhelatan musik Anda: manajemen tiket yang efisien, penyediaan peralatan panggung berstandar tinggi, tata pencahayaan spektakuler, hingga sistem keamanan yang ketat."
    }
];
