import axios from "axios";
import { triggerLogout } from "../lib/logoutHandler";

const Api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

const forceLogout = () => {
  triggerLogout(); // only clear state
};

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const url = originalRequest.url || "";
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const code = error.response?.data?.message;

    const isExpired =
        status === 401 && code === "TOKEN_EXPIRED";

    const isAuthRoute =
      url.includes("/refresh-token") ||
      url.includes("/login") ||
      url.includes("/register") ||
      url.includes("/me");

    //logout immediately if NOT expired
    // if (error.response?.status === 401 && !isExpired && !isAuthRoute) {
    //   triggerLogout();
    //   if (window.location.pathname !== "/login") {
    //     window.location.href = "/login";
    //   }
    //   return Promise.reject(error);
    // }
    // refresh only if expired
    if (
      status === 401 &&
      isExpired &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => Api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await Api.post("/users/refresh-token");

        processQueue(null);

        return Api(originalRequest);
      } catch (err) {
        processQueue(err);
        //refresh failed → logout
        forceLogout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    // 🔥 2. HANDLE INVALID TOKEN (NO RECOVERY)
    if (
      status === 401 &&
      !isExpired &&
      !isAuthRoute &&
      !originalRequest._retry
    ) {
      forceLogout();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },

);

export default Api;
