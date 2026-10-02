import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Tentang from "./pages/Tentang";
import Layanan from "./pages/Layanan";
import Event from "./pages/Event";
import Galeri from "./pages/Galeri";
import Kontak from "./pages/Kontak";

import Login from "./pages/Login";
import Admin from "./pages/Admin";



function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <>
                            <Navbar />
                            <Home />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/tentang"
                    element={
                        <>
                            <Navbar />
                            <Tentang />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/layanan"
                    element={
                        <>
                            <Navbar />
                            <Layanan />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/event"
                    element={
                        <>
                            <Navbar />
                            <Event />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/galeri"
                    element={
                        <>
                            <Navbar />
                            <Galeri />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/kontak"
                    element={
                        <>
                            <Navbar />
                            <Kontak />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <Admin />
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}


export default App;