import axios from "axios";
import type { Method } from "axios";

export type { Method };

export const api = axios.create({
  baseURL: "http://localhost:3333",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});