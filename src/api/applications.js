import api from "./axios";

const applyJobApi = (jobId, formData) => {
  return api.post(`/jobs/${jobId}/applications`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getMyApplicationsApi = () => {
  return api.get("/applications/my");
};

const withdrawApplicationApi = (id) => {
  return api.delete(`/applications/${id}`);
};

export { applyJobApi, getMyApplicationsApi, withdrawApplicationApi };
