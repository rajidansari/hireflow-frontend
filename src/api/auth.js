import api from "./axios";

// refresh api
export const refreshApi = async () => {
  const res = await api.get("/auth/refresh");

  return res;
};
