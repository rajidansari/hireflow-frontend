export const config = {
    apiBaseUrl:
        import.meta.env.MODE === "production"
            ? import.meta.env.VITE_API_BASE_URL_DEV
            : import.meta.env.VITE_API_BASE_URL_PROD,
};
