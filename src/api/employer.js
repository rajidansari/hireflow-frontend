import api from "./axios";

const getEmployerProfileApi = () => {
  return api.get("/employers/me");
};

const updateEmployerProfileApi = (data) => {
  return api.patch("/employers/me", data);
};

const updateEmployerLogoApi = (formData) => {
  return api.patch("/employers/me/logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export { getEmployerProfileApi, updateEmployerProfileApi, updateEmployerLogoApi };
