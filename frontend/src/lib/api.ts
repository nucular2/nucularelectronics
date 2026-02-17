import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 8000
});

api.interceptors.request.use((config: any) => {
  const t = localStorage.getItem("access_token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(
  (r: any) => r,
  async (error: any) => {
    if (error.response?.status === 401) {
      const rt = localStorage.getItem("refresh_token");
      if (rt) {
        const rr = await axios.post("/api/auth/refresh", { token: rt });
        localStorage.setItem("access_token", rr.data.accessToken);
        error.config.headers.Authorization = `Bearer ${rr.data.accessToken}`;
        return axios.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
