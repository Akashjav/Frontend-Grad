const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export function getToken() {
  return localStorage.getItem("access_token");
}

export function setToken(token: string) {
  localStorage.setItem("access_token", token);
}

export function removeToken() {
  localStorage.removeItem("access_token");
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Something went wrong");
  }

  return data;
}

export const api = {
  get: (endpoint: string) =>
    request(endpoint, {
      method: "GET",
    }),

  post: (endpoint: string, body?: any) =>
    request(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: (endpoint: string, body?: any) =>
    request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (endpoint: string) =>
    request(endpoint, {
      method: "DELETE",
    }),
};

