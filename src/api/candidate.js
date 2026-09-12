import api from "./axios";

const getCandidateProfileApi = () => {
  return api.get("/candidates/me");
};

const updateCandidateProfileApi = (data) => {
  return api.patch("/candidates/me", data);
};

export { getCandidateProfileApi, updateCandidateProfileApi };
