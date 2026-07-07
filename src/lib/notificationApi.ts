import { api } from "./api";

export async function getNotifications() {
  return api.get("/api/notifications/");
}

export async function markNotificationRead(id: number) {
  return api.post(`/api/notifications/${id}/read`);
}

export async function markAllNotificationsRead() {
  return api.post("/api/notifications/read-all");
}
