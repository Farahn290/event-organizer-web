import { Link } from "react-router-dom";

function Tentang() {

    return (

        <div className="page about-page">

            {/* HEADER */}

            <section className="about-hero">

                <div>

                    <p className="section-label">
                        ABOUT EVENTORA
                    </p>

                    <h1>
                        Menciptakan
                        <br />
                        Momen Yang
                        <br />
                        Berkesan.
                    </h1>

                </div>

            </section>


            {/* INTRODUCTION */}

            <section className="about-intro">

                <div>

                    <p className="section-label">
                        WHO WE ARE
                    </p>

                    <h2>
                        Partner Profesional
                        <br />
                        Untuk Setiap Acara.
                    </h2>

                </div>

                <div>

                    <p>
                        Eventora adalah perusahaan Event Organizer
                        yang hadir untuk membantu klien merancang,
                        mempersiapkan, dan menjalankan berbagai
                        jenis acara.
                    </p>

                    <p>
                        Kami percaya bahwa setiap acara memiliki
                        cerita dan karakter yang berbeda. Karena itu,
                        kami menghadirkan konsep yang disesuaikan
                        dengan kebutuhan dan tujuan setiap klien.
                    </p>

                    <p>
                        Dengan perencanaan yang matang, kreativitas,
                        dan koordinasi profesional, kami berusaha
                        memastikan setiap detail acara dapat berjalan
                        dengan baik.
                    </p>

                </div>

            </section>


            {/* VISI MISI */}

            <section className="about-values">

                <div className="value-box">

                    <span>
                        01
                    </span>

                    <h2>
                        Visi
                    </h2>

                    <p>
                        Menjadi perusahaan Event Organizer yang
                        terpercaya dan mampu memberikan pengalaman
                        acara yang kreatif, profesional, dan
                        berkesan bagi setiap klien.
                    </p>

                </div>


                <div className="value-box">

                    <span>
                        02
                    </span>

                    <h2>
                        Misi
                    </h2>

                    <p>
                        Memberikan layanan event yang profesional,
                        mengembangkan konsep acara yang kreatif,
                        serta membangun hubungan jangka panjang
                        dengan klien melalui pelayanan terbaik.
                    </p>

                </div>


                <div className="value-box">

                    <span>
                        03
                    </span>

                    <h2>
                        Nilai Kami
                    </h2>

                    <p>
                        Kreativitas, profesionalisme, komunikasi,
                        tanggung jawab, dan perhatian terhadap
                        setiap detail menjadi dasar dalam setiap
                        acara yang kami kerjakan.
                    </p>

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