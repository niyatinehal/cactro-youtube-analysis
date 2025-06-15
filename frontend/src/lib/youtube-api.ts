import {
  Video,
  Comment,
  Reply,
  VideoUpdateData,
  CreateCommentData,
  CreateReplyData,
} from "@/types";

const API = import.meta.env.VITE_API_BASE;

// ✅ Video
export async function getVideo(videoId: string): Promise<Video> {
  const res = await fetch(`${API}/api/youtube/video/${videoId}/details`);
  if (!res.ok) throw new Error("Failed to fetch video");
  const data = await res.json();
  return {
    ...data,
    views: data.views, 
  };
}

export async function updateVideo(videoId: string, data: VideoUpdateData): Promise<Video> {
  const res = await fetch(`${API}/api/video/Vjm2tRaqFlA`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update video");
  return res.json();
}

// ✅ Comments
export async function getComments(videoId: string): Promise<Comment[]> {
  const res = await fetch(`${API}/api/videos/${videoId}/comments`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function createComment(data: CreateCommentData): Promise<Comment> {
  const res = await fetch(`${API}/api/videos/${data.videoId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text_display: data.textOriginal,
      author_display_name: "My Developer Channel", // optional: replace with real user
      author_profile_image_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face",
    }),
  });
  if (!res.ok) throw new Error("Failed to create comment");
  return res.json();
}

export async function deleteComment(commentId: string): Promise<void> {
  const res = await fetch(`${API}/api/comments/${commentId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete comment");
}

// ✅ Replies
export async function createReply(data: CreateReplyData): Promise<Reply> {
  const res = await fetch(`${API}/api/comments/${data.parentId}/replies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text_display: data.textOriginal,
      author_display_name: "My Developer Channel",
      author_profile_image_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face",
    }),
  });
  if (!res.ok) throw new Error("Failed to create reply");
  return res.json();
}

export async function deleteReply(replyId: string): Promise<void> {
  const res = await fetch(`${API}/api/replies/${replyId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete reply");
}
