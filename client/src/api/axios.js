import axios from "axios";

const Api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
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

Api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!error.response) {
            return Promise.reject(error);
        }
        const isAuthRoute =
            originalRequest.url.includes("/refresh-token") ||
            originalRequest.url.includes("/login") ||
            originalRequest.url.includes("/register")||
            originalRequest.url.includes("/current-user");
        // avoid infinite loop
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthRoute
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return Api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await Api.post("/users/refresh-token");

                processQueue(null);

                return Api(originalRequest);
            } catch (err) {
                processQueue(err);
                if (err.response?.status === 401) {
                  // means no refresh token → user is logged out
                  return Promise.reject(err); // just stop here
                }
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default Api;
