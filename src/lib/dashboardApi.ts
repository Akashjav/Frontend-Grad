import { api } from "./api";

export async function getStudentDashboard() {
  return api.get("/api/dashboard/student");
}

export async function getAlumniDashboard() {
  return api.get("/api/dashboard/alumni");
}

export async function getAdminDashboard() {
  return api.get("/api/dashboard/admin");
}
