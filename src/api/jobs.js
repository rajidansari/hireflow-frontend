import api from "./axios";

// fetch all jobs
const getJobsApi = () => {
  return api.get("/jobs");
};

// fetch job details
const getJobDetailsApi = (id) => {
  return api.get(`/jobs/${id}`);
};

export { getJobsApi, getJobDetailsApi };
