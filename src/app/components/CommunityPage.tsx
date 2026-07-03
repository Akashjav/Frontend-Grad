import { useState } from "react";
import { Send, ThumbsUp, Plus, Bookmark, Hash, MessageCircle } from "lucide-react";
import { cn } from "../utils";
import { forumPosts } from "../data";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";
import Avatar from "./Avatar";

export default function CommunityPage() {
  const [activePost, setActivePost] = useState<null | number>(null);
  const [newPost, setNewPost] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);
  const [replyText, setReplyText] = useState("");

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>Community Forum</h2>
            <p className="text-gray-500 text-sm">Ask questions, share knowledge, and help each other grow</p>
          </div>
          <Btn icon={<Plus size={14} />} onClick={() => setNewPost(true)}>New Post</Btn>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {["All", "Placements", "Interview Prep", "System Design", "Career Guidance", "Internships", "Higher Studies", "General"].map(c => (
            <button key={c} className={cn("px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border",
              c === "All" ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700 bg-white")}>
              {c}
            </button>
          ))}
        </div>

        {/* New post form */}
        {newPost && (
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Ask the Community</h3>
            <input placeholder="Post title / Question" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" />
            <textarea rows={3} placeholder="Describe your question in detail..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3" />
            <div className="flex gap-2 justify-end">
              <Btn variant="outline" onClick={() => setNewPost(false)}>Cancel</Btn>
              <Btn onClick={() => setNewPost(false)}>Post</Btn>
            </div>
          </Card>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {forumPosts.map(p => (
            <Card key={p.id} className="p-5">
              <div className="flex items-start gap-3">
                <Avatar name={p.author} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{p.author}</span>
                      <span className="text-gray-400 text-xs ml-2">· {p.dept}</span>
                    </div>
                    <span className="text-xs text-gray-400">{p.time}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mt-1 mb-1 cursor-pointer hover:text-blue-600 transition-colors" style={{ fontFamily: "Poppins, sans-serif" }}
                    onClick={() => setActivePost(activePost === p.id ? null : p.id)}>
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.body}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.tags.map(t => <Badge key={t} color="indigo"><Hash size={10} /> {t}</Badge>)}
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => setLiked(l => l.includes(p.id) ? l.filter(id => id !== p.id) : [...l, p.id])}
                      className={cn("flex items-center gap-1.5 text-xs cursor-pointer transition-colors", liked.includes(p.id) ? "text-blue-600 font-medium" : "text-gray-500 hover:text-blue-600")}>
                      <ThumbsUp size={14} fill={liked.includes(p.id) ? "currentColor" : "none"} />
                      {p.likes + (liked.includes(p.id) ? 1 : 0)}
                    </button>
                    <button onClick={() => setActivePost(activePost === p.id ? null : p.id)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                      <MessageCircle size={14} /> {p.replies} replies
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors ml-auto">
                      <Bookmark size={14} /> Save
                    </button>
                  </div>

                  {/* Replies */}
                  {activePost === p.id && (
                    <div className="mt-4 space-y-3">
                      {[
                        { author: "Karthik Rajan", badge: "Alumni · Google", text: "CGPA matters less than your projects and problem-solving. Start contributing to open source and build a strong GitHub profile. That's what got me hired.", time: "1h ago" },
                        { author: "Sneha Patel", badge: "Alumni · Amazon", text: "Agree with Karthik. Focus on Leetcode (Medium) and one good project end-to-end. CGPA is rarely a filter at FAANG.", time: "45 min ago" },
                      ].map(r => (
                        <div key={r.author} className="flex gap-3 pl-4 border-l-2 border-blue-100">
                          <Avatar name={r.author} size="sm" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-gray-900">{r.author}</span>
                              <Badge color="teal">{r.badge}</Badge>
                              <span className="text-xs text-gray-400">{r.time}</span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{r.text}</p>
                            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 mt-1 cursor-pointer"><ThumbsUp size={11} /> 12</button>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-3 mt-3">
                        <Avatar name="Aryan Kapoor" size="sm" />
                        <div className="flex-1 flex gap-2">
                          <input value={replyText} onChange={e => setReplyText(e.target.value)}
                            placeholder="Write a reply..." className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          <Btn size="sm" icon={<Send size={13} />} onClick={() => setReplyText("")}>Reply</Btn>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

