import { api } from "./api";

export async function getAlumni() {
  return api.get("/api/alumni/");
}

export async function getAlumniById(id: number) {
  return api.get(`/api/alumni/${id}`);
}
