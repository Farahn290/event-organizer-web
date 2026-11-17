import axios from "axios";
import { backendOrigin } from "./media";

const api = axios.create({
    baseURL: `${backendOrigin}/api`
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && localStorage.getItem("adminToken")) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");
            if (window.location.pathname !== "/login") window.location.assign("/login");
        }
        return Promise.reject(error);
    }
);

export default api;