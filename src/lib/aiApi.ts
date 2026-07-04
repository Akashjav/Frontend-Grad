import { api } from "./api";

export async function sendAIMessage(prompt: string) {
  return api.post("/api/ai-chat/", { prompt });
}

export async function getAIHistory() {
  return api.get("/api/ai-chat/history");
}

export async function clearAIHistory() {
  return api.delete("/api/ai-chat/history");
}
