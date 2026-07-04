import { useEffect, useMemo, useState } from "react";
import {
  Send,
  ThumbsUp,
  Plus,
  Bookmark,
  Hash,
  MessageCircle,
} from "lucide-react";
import { cn } from "../utils";
import {
  getCommunities,
  joinCommunity,
  getCommunityPosts,
  createCommunityPost,
  likePost,
  unlikePost,
  getReplies,
  createReply,
  type CommunityId,
} from "../../lib/communityApi";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";
import Avatar from "./Avatar";

const TEST_COMMUNITY_NUMBER = "1";

function asArray(value: any): any[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.communities)) return value.communities;
  if (Array.isArray(value?.posts)) return value.posts;
  if (Array.isArray(value?.replies)) return value.replies;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}

function valueKey(value: any) {
  return value === undefined || value === null ? "" : String(value);
}

function communityIdFrom(community: any): CommunityId | null {
  return community?.id ?? community?.community_id ?? community?.uuid ?? null;
}

function postIdFrom(post: any): number | null {
  const id = Number(post?.id ?? post?.post_id);
  return Number.isFinite(id) ? id : null;
}

function resolveTestCommunity(communitiesResponse: any) {
  const communities = asArray(communitiesResponse);

  return (
    communities.find((community) =>
      [
        community?.legacy_id,
        community?.numeric_id,
        community?.display_id,
        community?.number,
        community?.community_number,
      ].some((value) => valueKey(value) === TEST_COMMUNITY_NUMBER)
    ) ??
    communities.find((community) => valueKey(communityIdFrom(community)) === TEST_COMMUNITY_NUMBER) ??
    communities[0] ??
    null
  );
}

function formatDate(value: any) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString();
}

function tagsFrom(value: any): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function authorName(item: any) {
  return (
    item?.author_name ??
    item?.author?.display_name ??
    item?.author?.full_name ??
    item?.author_id ??
    "User"
  );
}

function isPostLiked(post: any) {
  const value = post?.is_liked ?? post?.liked_by_me ?? post?.liked;
  if (typeof value === "string") return ["true", "1", "yes"].includes(value.toLowerCase());
  return Boolean(value);
}

function likeCount(post: any) {
  return post?.likes_count ?? post?.like_count ?? post?.likes ?? 0;
}

function replyCount(post: any) {
  return post?.replies_count ?? post?.reply_count ?? post?.replies ?? 0;
}

function ignoreAlreadyJoined(error: any) {
  return /already|member|joined|duplicate/i.test(String(error?.message ?? ""));
}

export default function CommunityPage() {
  const [activePost, setActivePost] = useState<null | number>(null);
  const [newPost, setNewPost] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postTags, setPostTags] = useState("");
  const [replies, setReplies] = useState<Record<number, any[]>>({});
  const [savingPost, setSavingPost] = useState(false);
  const [sendingReplyFor, setSendingReplyFor] = useState<number | null>(null);
  const [likingPost, setLikingPost] = useState<number | null>(null);

  const communityId = useMemo(() => communityIdFrom(community), [community]);

  useEffect(() => {
    let mounted = true;

    async function loadCommunity() {
      try {
        setLoading(true);
        setError("");

        const communitiesData = await getCommunities();
        const selectedCommunity = resolveTestCommunity(communitiesData);
        const selectedCommunityId = communityIdFrom(selectedCommunity);

        if (!selectedCommunity || !selectedCommunityId) {
          throw new Error("No community is available for this student.");
        }

        try {
          await joinCommunity(selectedCommunityId);
        } catch (joinError: any) {
          if (!ignoreAlreadyJoined(joinError)) throw joinError;
        }

        const postsData = await getCommunityPosts(selectedCommunityId);

        if (!mounted) return;
        setCommunity(selectedCommunity);
        setPosts(asArray(postsData));
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load community posts");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCommunity();

    return () => {
      mounted = false;
    };
  }, []);

  async function refreshPosts(currentCommunityId = communityId) {
    if (!currentCommunityId) return;

    const data = await getCommunityPosts(currentCommunityId);
    setPosts(asArray(data));
  }

  async function handleCreatePost() {
    if (!communityId || !postTitle.trim() || !postBody.trim()) return;

    setSavingPost(true);

    try {
      await createCommunityPost(communityId, {
        title: postTitle.trim(),
        body: postBody.trim(),
        tags: postTags.trim() || undefined,
      });

      setPostTitle("");
      setPostBody("");
      setPostTags("");
      setNewPost(false);
      await refreshPosts();
    } catch (err: any) {
      alert(err.message || "Failed to create post");
    } finally {
      setSavingPost(false);
    }
  }

  async function handleLike(post: any) {
    const postId = postIdFrom(post);
    if (postId === null || likingPost === postId) return;

    setLikingPost(postId);

    try {
      if (isPostLiked(post)) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }

      await refreshPosts();
    } catch (err: any) {
      alert(err.message || "Failed to update like");
    } finally {
      setLikingPost(null);
    }
  }

  async function handleOpenReplies(post: any) {
    const postId = postIdFrom(post);
    if (postId === null) return;

    if (activePost === postId) {
      setActivePost(null);
      return;
    }

    setActivePost(postId);

    try {
      const data = await getReplies(postId);
      setReplies((prev) => ({
        ...prev,
        [postId]: asArray(data),
      }));
    } catch (err: any) {
      alert(err.message || "Failed to load replies");
    }
  }

  async function handleReply(post: any) {
    const postId = postIdFrom(post);
    if (postId === null || !replyText.trim()) return;

    setSendingReplyFor(postId);

    try {
      await createReply(postId, {
        body: replyText.trim(),
      });

      setReplyText("");

      const data = await getReplies(postId);
      setReplies((prev) => ({
        ...prev,
        [postId]: asArray(data),
      }));

      await refreshPosts();
    } catch (err: any) {
      alert(err.message || "Failed to add reply");
    } finally {
      setSendingReplyFor(null);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-6 max-w-5xl mx-auto">Loading community posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-6 max-w-5xl mx-auto text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="font-bold text-gray-900 text-xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Community Forum
            </h2>
            <p className="text-gray-500 text-sm">
              {community?.name ?? "Community 1"} posts, replies, and discussions
            </p>
          </div>
          <Btn icon={<Plus size={14} />} onClick={() => setNewPost(true)}>
            New Post
          </Btn>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            "All",
            "Placements",
            "Interview Prep",
            "System Design",
            "Career Guidance",
            "Internships",
            "Higher Studies",
            "General",
          ].map((category) => (
            <button
              key={category}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border",
                category === "All"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700 bg-white"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {newPost && (
          <Card className="p-5">
            <h3
              className="font-semibold text-gray-900 mb-3"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Ask the Community
            </h3>
            <input
              value={postTitle}
              onChange={(event) => setPostTitle(event.target.value)}
              placeholder="Post title / Question"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />
            <textarea
              value={postBody}
              onChange={(event) => setPostBody(event.target.value)}
              rows={3}
              placeholder="Describe your question in detail..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
            />
            <input
              value={postTags}
              onChange={(event) => setPostTags(event.target.value)}
              placeholder="Tags comma separated: Java, Placement"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />
            <div className="flex gap-2 justify-end">
              <Btn variant="outline" onClick={() => setNewPost(false)}>
                Cancel
              </Btn>
              <Btn onClick={handleCreatePost} disabled={savingPost || !postTitle.trim() || !postBody.trim()}>
                {savingPost ? "Posting..." : "Post"}
              </Btn>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {posts.map((post) => {
            const postId = postIdFrom(post);
            const liked = isPostLiked(post);
            const tags = tagsFrom(post.tags);

            return (
              <Card key={postId ?? post.title} className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={authorName(post)} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-semibold text-gray-900 text-sm">{authorName(post)}</span>
                        <span className="text-gray-400 text-xs ml-2">- Community Member</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(post.created_at)}</span>
                    </div>
                    <h3
                      className="font-semibold text-gray-900 mt-1 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                      onClick={() => handleOpenReplies(post)}
                    >
                      {post.title ?? "Untitled post"}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{post.body}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} color="indigo">
                          <Hash size={10} /> {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleLike(post)}
                        disabled={postId === null || likingPost === postId}
                        className={cn(
                          "flex items-center gap-1.5 text-xs cursor-pointer transition-colors disabled:opacity-60",
                          liked ? "text-blue-600 font-medium" : "text-gray-500 hover:text-blue-600"
                        )}
                      >
                        <ThumbsUp size={14} fill={liked ? "currentColor" : "none"} />
                        {likeCount(post)}
                      </button>
                      <button
                        onClick={() => handleOpenReplies(post)}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors"
                      >
                        <MessageCircle size={14} /> {replyCount(post)} replies
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors ml-auto">
                        <Bookmark size={14} /> Save
                      </button>
                    </div>

                    {postId !== null && activePost === postId && (
                      <div className="mt-4 space-y-3">
                        {(replies[postId] || []).map((reply: any) => (
                          <div key={reply.id ?? reply.body} className="flex gap-3 pl-4 border-l-2 border-blue-100">
                            <Avatar name={authorName(reply)} size="sm" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-gray-900">{authorName(reply)}</span>
                                <Badge color="teal">Member</Badge>
                                <span className="text-xs text-gray-400">{formatDate(reply.created_at)}</span>
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{reply.body}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-3 mt-3">
                          <Avatar name="Aryan Kapoor" size="sm" />
                          <div className="flex-1 flex gap-2">
                            <input
                              value={replyText}
                              onChange={(event) => setReplyText(event.target.value)}
                              placeholder="Write a reply..."
                              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Btn
                              size="sm"
                              icon={<Send size={13} />}
                              onClick={() => handleReply(post)}
                              disabled={sendingReplyFor === postId || !replyText.trim()}
                            >
                              {sendingReplyFor === postId ? "Sending..." : "Reply"}
                            </Btn>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {posts.length === 0 && (
            <Card className="p-8 text-center">
              <MessageCircle size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">No posts yet</p>
              <p className="text-sm text-gray-500 mt-1">Create the first post for this community.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
