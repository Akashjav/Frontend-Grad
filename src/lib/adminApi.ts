import { api } from "./api";

export async function getAdminDashboard() {
  return api.get("/api/dashboard/admin");
}

export async function getUsers() {
  return api.get("/api/admin/users");
}

export async function updateUserRole(userId: string, role: string) {
  return api.patch(`/api/admin/users/${userId}/role`, {
    role,
  });
}

export async function verifyStudentDocument(documentId: number) {
  return api.patch(`/api/admin/student-documents/${documentId}/verify`);
}
