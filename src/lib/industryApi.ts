import { api } from "./api";

export type Domain = { id: number; name: string };
export type Opportunity = { id: number; title: string; description: string; domain_id: number; discipline_id: number | null; kind: string; location: string; status: string; approved: boolean; cross_domain: boolean };
export type Requirement = { id: number; skill_id: number; level: number; core: boolean };
export type Application = { id: number; student_id: string; status: string; progress: number };
export type Candidate = { user_id: string; display_name: string; score: number; skill_gaps: { skill_id: number; gap_score: number }[] };
const root = "/api/v1";
export const industryApi = {
  domains: (): Promise<Domain[]> => api.get(`${root}/domains`),
  opportunities: (): Promise<Opportunity[]> => api.get(`${root}/industry/me/opportunities`),
  create: (data: object): Promise<Opportunity> => api.post(`${root}/opportunities`, data),
  requirements: (id: number): Promise<Requirement[]> => api.get(`${root}/opportunities/${id}/requirements`),
  addRequirement: (id: number, skill: number, level: number) => api.post(`${root}/opportunities/${id}/requirements`, { skill_id: skill, level }),
  skills: (domain?: number): Promise<Domain[]> => api.get(`${root}/skills?limit=200${domain ? `&domain_id=${domain}` : ""}`),
  disciplines: (domain: number): Promise<Domain[]> => api.get(`${root}/domains/${domain}/disciplines`),
  publish: (id: number) => api.post(`${root}/opportunities/${id}/publish`, {}),
  archive: (id: number) => api.delete(`${root}/opportunities/${id}`),
  applications: (id: number): Promise<Application[]> => api.get(`${root}/opportunities/${id}/applications`),
  status: (id: number, status: string) => api.patch(`${root}/applications/${id}/status`, { status }),
  matches: (id: number, faculty: boolean): Promise<Candidate[]> => api.get(`${root}/industry/me/${faculty ? "faculty" : "candidate"}-matches?opportunity_id=${id}`),
  profile: (data: object) => api.patch(`${root}/industry/me/profile`, data),
};
