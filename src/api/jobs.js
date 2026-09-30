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

// employer's job applications
const getJobApplicationsApi = (jobId, params) => {
  return api.get(`/jobs/${jobId}/applications`, { params });
};

// create job
const createJobApi = (data) => {
  return api.post("/jobs", data);
};

export {
  getJobsApi,
  getJobDetailsApi,
  getEmployerPostedJobsApi,
  deletePostedJobApi,
  getJobApplicationsApi,
  createJobApi,
};
