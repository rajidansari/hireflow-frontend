import api from "./axios";

// fetch all jobs
const getJobsApi = () => {
  return api.get("/jobs");
};

// fetch job details
const getJobDetailsApi = (id) => {
  return api.get(`/jobs/${id}`);
};

// fetch employer posted jobs
const getEmployerPostedJobsApi = () => {
  return api.get("/jobs/my-jobs");
};

const deletePostedJobApi = (jobid) => {
  return api.delete(`/jobs/${jobid}`);
};

export { getJobsApi, getJobDetailsApi, getEmployerPostedJobsApi, deletePostedJobApi };
