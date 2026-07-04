import { api } from "./api";

export async function createMentorshipRequest(data: any) {
  return api.post("/api/mentorship/requests", data);
}

export async function getMyRequests() {
  return api.get("/api/mentorship/requests/my");
}

export async function getIncomingRequests() {
  return api.get("/api/mentorship/requests/incoming");
}

export async function acceptRequest(id: number) {
  return api.patch(`/api/mentorship/requests/${id}/accept`);
}

export async function rejectRequest(id: number) {
  return api.patch(`/api/mentorship/requests/${id}/reject`);
}

export async function createSession(data: any) {
  return api.post("/api/mentorship/sessions", data);
}

export async function getSessions() {
  return api.get("/api/mentorship/sessions");
}

export async function completeSession(id: number) {
  return api.patch(`/api/mentorship/sessions/${id}/complete`);
}
