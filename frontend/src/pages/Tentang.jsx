import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Tentang() {

    return (

        <div className="page about-page">

            {/* HEADER */}
            <section className="about-profile">
                <div className="about-profile-copy">
                    <p className="about-profile-eyebrow">
                        <span aria-hidden="true">✦</span> ABOUT MAQNET KREASINDO
                    </p>

                    <h1>
                        We Create
                        <br />
                        <span>Unforgettable</span>
                        <br />
                        Moments
                    </h1>

                    <p className="about-profile-description">
                        Maqnet is one of the leading event organizer companies in Indonesia, providing complete solutions in branding, marketing, communication, strategy, digital execution, events, and printing for major industry players.
                    </p>

                    <p className="about-profile-description">
                        We prioritize integrity, strong teamwork, and innovation in every project, building trust with our clients and audiences.
                    </p>

                    <div className="about-profile-values">
                        <article>
                            <span>01</span>
                            <h2>Visi Kami</h2>
                            <p>Menjadi mitra event terpercaya dengan pengalaman kreatif dan standar eksekusi tinggi.</p>
                        </article>
                        <article>
                            <span>02</span>
                            <h2>Misi Kami</h2>
                            <p>Menghadirkan konsep, produksi, dan layanan yang menyatukan setiap detail acara.</p>
                        </article>
                        <article>
                            <span>03</span>
                            <h2>Nilai Kami</h2>
                            <p>Integritas, kolaborasi, inovasi, dan komitmen pada kualitas.</p>
                        </article>
                    </div>

                    <Link to="/layanan" className="about-profile-link">
                        LEARN MORE ABOUT OUR SERVICES <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                </div>

                <div className="about-photo-grid" aria-label="Dokumentasi acara Maqnet Kreasindo">
                    <img
                        className="about-photo-featured"
                        src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85"
                        alt="Suasana acara perusahaan di ballroom"
                    />
                    <img
                        src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=85"
                        alt="Dekorasi perayaan elegan"
                    />
                    <img
                        src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=85"
                        alt="Produksi konferensi dan panggung"
                    />
                    <img
                        src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=85"
                        alt="Jamuan acara di ballroom"
                    />
                </div>
            </section>


            {/* WHY US */}

            <section className="about-why">

                <div>

                    <p className="section-label">
                        WHY EVENTORA
                    </p>

                    <h2>
                        Kenapa Memilih
                        <br />
                        Eventora?
                    </h2>

                </div>


                <div className="why-list">

                    <div>

                        <span>
                            01
                        </span>

                        <div>

                            <h3>
                                Konsep Kreatif
                            </h3>

                            <p>
                                Kami membantu mengembangkan konsep
                                acara yang sesuai dengan karakter
                                dan kebutuhan klien.
                            </p>

                        </div>

                    </div>


                    <div>

                        <span>
                            02
                        </span>

                        <div>

                            <h3>
                                Perencanaan Profesional
                            </h3>

                            <p>
                                Setiap acara direncanakan secara
                                terstruktur mulai dari konsep hingga
                                pelaksanaan.
                            </p>

                        </div>

                    </div>


                    <div>

                        <span>
                            03
                        </span>

                        <div>

                            <h3>
                                Tim Berpengalaman
                            </h3>

                            <p>
                                Tim kami bekerja secara kolaboratif
                                untuk memastikan kebutuhan acara
                                dapat terpenuhi.
                            </p>

                        </div>

                    </div>


                    <div>

                        <span>
                            04
                        </span>

                        <div>

                            <h3>
                                Perhatian Pada Detail
                            </h3>

                            <p>
                                Kami memperhatikan setiap detail
                                agar pengalaman acara menjadi
                                lebih maksimal.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* CTA */}

            <section className="about-cta">

                <p className="section-label">
                    LET'S WORK TOGETHER
                </p>

                <h2>
                    Punya Rencana
                    <br />
                    Event?
                </h2>

                <Link
                    to="/kontak"
                    className="cta-button"
                >
                    Hubungi Kami →
                </Link>

            </section>

        </div>

    );
}

export default Tentang;