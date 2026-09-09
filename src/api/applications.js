import api from "./axios";

const applyJobApi = (jobId, formData) => {
  return api.post(`/jobs/${jobId}/applications`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export { applyJobApi };
