import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

export async function generateTests(payload) {
  const { data } = await client.post("/api/generate-tests", payload);
  return data;
}
