import { api } from "./api";

export async function getStudentDashboard() {
  return api.get("/api/dashboard/student");
}
