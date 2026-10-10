import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Tentang() {
    return (
        <div className="page about-page">
            <section className="about-profile">
                <div className="about-profile-copy">
                    <p className="about-profile-eyebrow">ABOUT MAQNET KREASINDO</p>

                    <h1 className="about-profile-title">
                        <span>We Create</span>
                        <span className="about-profile-title-accent">Unforgettable</span>
                        <span>Moments</span>
                    </h1>

                    <p className="about-profile-description">
                        Magnet is one of the leading advertising group companies in Indonesia that provides complete solutions in branding, marketing, communication, technology, strategy &amp; digital execution, events and printing for major industry players in Indonesia.
                    </p>

                    <p className="about-profile-description about-profile-description-secondary">
                        We prioritize integrity, strong teamwork, innovation in every work we do, and always strive to build trust for clients and audiences.
                    </p>

                    <div className="about-profile-values">
                        <article>
                            <span className="about-card-number">01</span>
                            <h2>Visi Kami</h2>
                            <p>
                                Menjadi penyedia jasa promosi &amp; publikasi (ATL &amp; BTL)
                                yang dapat diandalkan dan terpercaya.
                            </p>
                            <p>
                                Selalu mengikuti perkembangan kreativitas dan teknologi digital.
                            </p>
                        </article>
                        <article>
                            <span className="about-card-number">02</span>
                            <h2>Misi Kami</h2>
                            <p>
                                Menciptakan solusi kreatif untuk kebutuhan promosi, event, dan
                                pencetakan bagi klien.
                            </p>
                            <p>
                                Berkontribusi dalam pembangunan dan penciptaan lapangan kerja.
                            </p>
                        </article>
                        <article>
                            <span className="about-card-number">03</span>
                            <h2>Nilai Kami</h2>
                            <p>
                                Integritas, kolaborasi, inovasi, dan komitmen pada kualitas
                                dalam setiap langkah kerja.
                            </p>
                        </article>
                    </div>

                    <Link to="/layanan" className="about-profile-link">
                        Learn More About Our Magnet Kreasindo <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                </div>

                <div className="about-visual-column">
                    <div className="about-photo-grid" aria-label="Layanan Maqnet Kreasindo">
                        <div className="about-photo-card photo-square">
                            <img src="/exhibition-contractor.png" alt="Booth pameran Pertamina Digital" />
                        </div>
                        <div className="about-photo-card photo-square">
                            <img src="/pertamina-digital-display.png" alt="Display aplikasi MyPertamina" />
                        </div>
                    </div>

                    <div className="about-service-stack" aria-label="Layanan utama">
                        <div className="about-service-card about-service-card-large">
                            <div className="about-service-icon" aria-hidden="true">
                                <span>✦</span>
                            </div>
                            <span>Exhibition Contractor</span>
                        </div>
                        <div className="about-service-card about-service-card-large">
                            <div className="about-service-icon" aria-hidden="true">
                                <span>✦</span>
                            </div>
                            <span>One Stop Printing Solution</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Tentang;