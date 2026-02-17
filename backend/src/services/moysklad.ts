import axios from "axios";

const baseURL = "https://api.moysklad.ru/api/remap/1.2";
const token = process.env.MOYSKLAD_TOKEN || "";

const client = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json"
  },
  timeout: 10000
});

export async function getInventory() {
  const r = await client.get("/entity/product");
  return r.data;
}

export async function createOrder(payload: unknown) {
  const r = await client.post("/entity/customerorder", payload);
  return r.data;
}
