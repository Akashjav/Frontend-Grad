import { api } from "./api";

export async function getMyProfile() {
  return api.get("/api/me");
}

export async function getSettingsProfile() {
  return api.get("/api/settings/");
}

export async function updateAccountProfile(data: any) {
  return api.patch("/api/settings/account", data);
}
