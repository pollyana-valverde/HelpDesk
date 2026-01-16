import axios from "axios";
import type { Method } from "axios";

export type { Method };

const LOCAL_STORAGE_KEY = "@helpdesk";

const api = axios.create({
  baseURL: "http://localhost:3333",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Sessão expirada. Redirecionando para login...");

      localStorage.removeItem(`${LOCAL_STORAGE_KEY}:token`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`);

      window.location.assign("/");
    }

    return Promise.reject(error);
  }
);

export { api };

