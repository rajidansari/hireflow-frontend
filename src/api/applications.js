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

// update application status
const updateApplicationStatusApi = ({ applicationId, status }) => {
  return api.patch(`/applications/${applicationId}/status`, { status });
};

export { applyJobApi, getMyApplicationsApi, withdrawApplicationApi, updateApplicationStatusApi };
