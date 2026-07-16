import api from "./axios";

// refresh api
export const refreshApi = async () => {
  const res = await api.get("/auth/refresh");

  return res;
};

export const registerApi = async (data) => {
  return await api.post("/auth/register", data);
};

export const verifyEmail = async (data) => {
  return await api.patch("/auth/verify-email", data);
};

export const loginApi = async (data) => {
  return await api.post("/auth/login", data);
};
