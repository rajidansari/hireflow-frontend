import api from "./axios";

const getCandidateProfileApi = () => {
  return api.get("/candidates/me");
};

const updateCandidateProfileApi = (data) => {
  return api.patch("/candidates/me", data);
};

const updateCandidateCvApi = (formData) => {
  return api.patch(`candidates/me/cv`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export { getCandidateProfileApi, updateCandidateProfileApi, updateCandidateCvApi };
