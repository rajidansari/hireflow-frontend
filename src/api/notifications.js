import api from "./axios";

const getNotificationsApi = () => {
  return api.get("/notifications");
};

const markReadNotificationApi = (id) => {
  return api.patch(`/notifications/${id}`);
};

const markReadAllNotificationsApi = () => {
  return api.patch("/notifications/seen");
};

const deleteOneNotificationApi = (id) => {
  return api.delete(`/notifications/${id}`);
};

const deleteReadNotificationsApi = () => {
  return api.delete("/notifications/seen");
};

const deleteAllNotificationsApi = () => {
  return api.delete("/notifications");
};

export {
  getNotificationsApi,
  markReadNotificationApi,
  markReadAllNotificationsApi,
  deleteOneNotificationApi,
  deleteReadNotificationsApi,
  deleteAllNotificationsApi,
};
