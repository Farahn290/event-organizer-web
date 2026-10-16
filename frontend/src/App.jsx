import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import IntroSplash from "./components/IntroSplash";

import Home from "./pages/Home";
import Tentang from "./pages/Tentang";
import Layanan from "./pages/Layanan";
import LayananDetail from "./pages/LayananDetail";
import Event from "./pages/Event";
import Galeri from "./pages/Galeri";
import Kontak from "./pages/Kontak";

import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { LanguageProvider } from "./contexts/LanguageContext";



function App() {

    return (

        <BrowserRouter>

            <LanguageProvider>
            <IntroSplash />
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
                    path="/layanan/:id"
                    element={
                        <>
                            <Navbar />
                            <LayananDetail />
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
            </LanguageProvider>

        </BrowserRouter>

    );
}


export default App;