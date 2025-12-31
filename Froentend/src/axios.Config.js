import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASEURL || "http://localhost:3000",
    withCredentials: true, // 🔥 compulsory
});

export default instance;