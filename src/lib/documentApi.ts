import { api } from "./api";

export async function getDocuments() {
  return api.get("/api/student/documents/");
}

export async function uploadDocument(documentType: string, file: File) {
  const formData = new FormData();

  formData.append("document_type", documentType);
  formData.append("file", file);

  return api.post("/api/student/documents/", formData);
}
