import api from "./axios";

// refresh api
const refreshApi = async () => {
  const res = await api.get("/auth/refresh");

  return res;
};

const registerApi = async (data) => {
  return await api.post("/auth/register", data);
};

const verifyEmail = async (data) => {
  return await api.patch("/auth/verify-email", data);
};

const loginApi = async (data) => {
  return await api.post("/auth/login", data);
};

const forgotPasswordApi = async (data) => {
  return await api.post("/auth/forgot-password", data);
};

const verifyResetOtpApi = async (data) => {
  return await api.post("/auth/verify-reset-otp", data);
};

const passwordResetApi = async (data) => {
  return await api.patch("/auth/reset-password", data);
};

export {
  refreshApi,
  registerApi,
  verifyEmail,
  loginApi,
  forgotPasswordApi,
  verifyResetOtpApi,
  passwordResetApi,
};
