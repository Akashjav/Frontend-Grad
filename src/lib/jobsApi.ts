import { api } from "./api";

export function getJobs() {
  return api.get("/api/jobs/");
}

export function getSavedJobs() {
  return api.get("/api/jobs/saved");
}

export function getAppliedJobs() {
  return api.get("/api/jobs/applied");
}

export function saveJob(jobId: number) {
  return api.post(`/api/jobs/${jobId}/save`);
}

export function applyJob(jobId: number) {
  return api.post(`/api/jobs/${jobId}/apply`);
}
