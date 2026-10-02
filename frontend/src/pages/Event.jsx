import { useEffect, useState } from "react";
import api from "../services/api";

function Event() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const getEvents = async () => {

            try {

                const response = await api.get("/events/");

                console.log("Event API:", response.data);

                if (response.data.success) {

                    setEvents(response.data.data);

                } else {

                    setError(
                        response.data.message ||
                        "Gagal mengambil data event"
                    );

                }

            } catch (error) {

                console.error("Event Error:", error);

                setError(
                    error.response?.data?.message ||
                    "Tidak dapat terhubung ke server"
                );

            } finally {

                setLoading(false);

            }
        };

        getEvents();

    }, []);

    return (
        <div className="page">

            <section className="page-header">

                <p>OUR EVENTS</p>

                <h1>Event</h1>

                <span>
                    Berbagai event yang telah kami kelola.
                </span>

            </section>


            <section className="event-section">

                <div className="event-container">

                    {loading && (
                        <p>Memuat event...</p>
                    )}


                    {!loading && error && (
                        <p>{error}</p>
                    )}


                    {!loading &&
                        !error &&
                        events.length === 0 && (

                            <p>
                                Belum ada event.
                            </p>

                        )}


                    {!loading &&
                        !error &&
                        events.map((event) => (

                            <div
                                className="event-card"
                                key={event.id}
                            >

                                <div className="event-date">

                                    <strong>
                                        {event.tanggal}
                                    </strong>

                                </div>


                                <div className="event-content">

                                    <h2>
                                        {event.nama_event}
                                    </h2>

                                    <p>
                                        📍 {event.lokasi}
                                    </p>

                                    <span>
                                        {event.deskripsi}
                                    </span>

                                </div>

                            </div>

                        ))}

                </div>

            </section>

        </div>
    );
}

export default Event;