import axios from "axios";
import { config } from "../config";

const api = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: 5000,
});

api.interceptors.request.use(
    function (config) {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    function (error) {
        return Promise.reject(error);
    },
);

const MAX_RETRIES = 3;
const RETRY_DELAY_MX = 1000;

api.interceptors.response.use(
    function (response) {
        return response;
    },

    async function (error) {
        const { config: requestConfig, response } = error;

        if (
            response?.status === 401 &&
            response?.data?.message === "Token Expired"
        ) {
            try {
                const res = await api.get("/auth/refresh");

                setAccessToken(res.data.accessToken);

                requestConfig.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return api(requestConfig);
            } catch (error) {
                clearAuth();
                return Promise.reject(error);
            }
        } else {
            // if config deosn't exist, then reject immediately
            if (!requestConfig) {
                return Promise.reject(error);
            }

            requestConfig.__retryCount = requestConfig.__retryCount || 0;

            // retry condition
            const isNetworkError = !response;
            const isServerError = response && response.status >= 500;

            const shouldRetry =
                requestConfig.__retryCount < MAX_RETRIES &&
                (isNetworkError || isServerError);

            if (shouldRetry) {
                requestConfig.__retryCount += 1;

                console.log(
                    `Retrying request (${requestConfig.__retryCount}/${MAX_RETRIES}) for URL: ${requestConfig.url}`,
                );

                await new Promise((resolve) =>
                    setTimeout(resolve, RETRY_DELAY_MX),
                );

                return api(requestConfig);
            }
        }

        return Promise.reject(error);
    },
);
