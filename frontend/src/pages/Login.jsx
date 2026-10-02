import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login.php",
                {
                    email: email,
                    password: password
                }
            );

            console.log("Response:", response.data);


            if (response.data.success) {

                localStorage.setItem(
                    "admin",
                    JSON.stringify(response.data.data)
                );

                navigate("/admin");

            } else {

                setError(
                    response.data.message ||
                    "Email atau password salah"
                );

            }

        } catch (error) {

            console.error("Login Error:", error);

            setError(
                error.response?.data?.message ||
                "Tidak dapat terhubung ke server"
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#111",
                fontFamily: "Arial"
            }}
        >

            <div
                style={{
                    width: "400px",
                    background: "#fff",
                    padding: "40px",
                    boxSizing: "border-box"
                }}
            >

                <h1>
                    EVENTORA
                </h1>

                <p>
                    Admin Login
                </p>


                {error && (

                    <div
                        style={{
                            padding: "12px",
                            marginBottom: "20px",
                            background: "#ffe5e5",
                            color: "#b00000"
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
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="admin@eventora.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "12px",
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
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px",
                                boxSizing: "border-box"
                            }}
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: "#111",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        {loading
                            ? "LOGIN..."
                            : "LOGIN"
                        }
                    </button>

                </form>

            </div>

        </div>

    );
}

export default Login;