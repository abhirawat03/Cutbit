import axios from "axios";
import { queryClient } from "../lib/queryClient";

const Api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
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

        // avoid infinite loop
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/refresh-token") &&
            !originalRequest.url.includes("/login") &&
            !originalRequest.url.includes("/register")
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

                processQueue();

                return Api(originalRequest);
            } catch (err) {
                processQueue(err);

                // clear cached user data
                queryClient.clear();

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default Api;
