import { api } from "./api";

export type CommunityId = string | number;

export async function getCommunities() {
  return api.get("/api/communities/");
}

export async function joinCommunity(communityId: CommunityId) {
  return api.post(`/api/communities/${encodeURIComponent(String(communityId))}/join`);
}

export async function getCommunityPosts(communityId: CommunityId) {
  return api.get(`/api/communities/${encodeURIComponent(String(communityId))}/posts`);
}

export async function createCommunityPost(communityId: CommunityId, data: any) {
  return api.post(`/api/communities/${encodeURIComponent(String(communityId))}/posts`, data);
}

export async function likePost(postId: number) {
  return api.post(`/api/community-posts/${postId}/like`);
}

export async function unlikePost(postId: number) {
  return api.delete(`/api/community-posts/${postId}/like`);
}

export async function getReplies(postId: number) {
  return api.get(`/api/community-posts/${postId}/replies`);
}

export async function createReply(postId: number, data: any) {
  return api.post(`/api/community-posts/${postId}/replies`, data);
}
