import { api, setToken, removeToken, formatApiError } from "./api";

export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(formatApiError(data, res.status));
  }

  setToken(data.access_token);
  return data;
}

export async function getMe() {
  return api.get("/api/me");
}

export async function logout() {
  removeToken();
}

export async function studentSignup(data: any) {
  const res = await api.post("/api/auth/signup/student", data);
  setToken(res.access_token);
  return res;
}

export async function alumniSignup(data: any) {
  const res = await api.post("/api/auth/signup/alumni", data);
  setToken(res.access_token);
  return res;
}
