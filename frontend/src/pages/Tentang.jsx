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
                        About MaqnetKreasindo
                    </h1>

                    <p className="about-profile-description">
                       PT Maqnet Kreasindo adalah salah satu perusahaan grup periklanan terkemuka di Indonesia yang memberikan solusi lengkap dalam branding, pemasaran, komunikasi, teknologi, strategi & eksekusi digital, acara dan pencetakan untuk pemain industri besar di Indonesia.   Kami mengutamakan integritas, kerja tim yang kuat, inovasi dalam setiap pekerjaan yang kami lakukan, dan selalu berusaha membangun kepercayaan bagi klien dan audiens
                    </p>

                    <p className="about-profile-description">
                        .
                    </p>

                    <div className="about-profile-values">
                        <article>
                            <span>01</span>
                            <h2>VISI KAMI</h2>
                            <p>
                                Menjadi penyedia jasa promosi &amp; publikasi (ATL &amp; BTL)
                                yang dapat diandalkan dan terpercaya, serta selalu update dalam
                                pengembangan kreativitas seiring majunya dunia teknologi digital.
                            </p>
                        </article>
                        <article>
                            <span>02</span>
                            <h2>MISI KAMI</h2>
                            <p>
                                Menjadi wadah atau sarana berinvestasi yang menguntungkan bagi
                                para pemegang saham hingga klien pengguna jasa, serta berkontribusi
                                dalam pembangunan dan penciptaan lapangan kerja.
                            </p>
                        </article>
                        <article>
                            <span>03</span>
                            <h2>NILAI KAMI</h2>
                            <p>
                                Integritas, kolaborasi, inovasi, dan komitmen pada kualitas dalam
                                setiap langkah kerja kami.
                            </p>
                        </article>
                    </div>

                    <Link to="/layanan" className="about-profile-link">
                        LEARN MORE ABOUT OUR SERVICES <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                </div>

                <div className="about-photo-grid" aria-label="Layanan Maqnet Kreasindo">
                    <img
                        className="about-photo-featured"
                        src="/tentang-1.jpg"
                        alt="Out of Home Advertisement"
                    />
                    <img
                        src="/tentang-2.jpg"
                        alt="Event Management"
                    />
                    <img
                        src="/tentang-3.jpg"
                        alt="Exhibition Contractor"
                    />
                    <img
                        src="/tentang-4.jpg"
                        alt="One Stop Printing Solution"
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