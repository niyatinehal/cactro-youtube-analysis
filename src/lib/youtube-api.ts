import {
  Video,
  Comment,
  Reply,
  VideoUpdateData,
  CreateCommentData,
  CreateReplyData,
} from "@/types";

// Mock data for demonstration
const mockVideo: Video = {
  id: "dQw4w9WgXcQ",
  title: "My Amazing Video Tutorial",
  description:
    "In this comprehensive tutorial, I walk through the complete process of building a modern web application. We cover everything from initial setup to deployment, including best practices for code organization, performance optimization, and user experience design.",
  thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  publishedAt: "2024-01-15T10:30:00Z",
  viewCount: 15234,
  likeCount: 892,
  commentCount: 47,
  duration: "PT15M32S",
  privacyStatus: "unlisted",
  tags: ["tutorial", "web development", "programming", "react", "typescript"],
  channelTitle: "My Developer Channel",
};

const mockComments: Comment[] = [
  {
    id: "comment-1",
    videoId: "dQw4w9WgXcQ",
    authorDisplayName: "TechEnthusiast",
    authorProfileImageUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
    textDisplay:
      "Great tutorial! The explanation was clear and easy to follow. Thanks for sharing!",
    publishedAt: "2024-01-16T14:20:00Z",
    likeCount: 12,
    canReply: true,
    replies: [
      {
        id: "reply-1",
        parentId: "comment-1",
        authorDisplayName: "My Developer Channel",
        authorProfileImageUrl:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face",
        textDisplay: "Thank you so much! Glad it was helpful.",
        publishedAt: "2024-01-16T15:45:00Z",
        likeCount: 5,
      },
    ],
  },
  {
    id: "comment-2",
    videoId: "dQw4w9WgXcQ",
    authorDisplayName: "CodeNewbie",
    authorProfileImageUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=40&h=40&fit=crop&crop=face",
    textDisplay: "Could you make a follow-up video on deployment strategies?",
    publishedAt: "2024-01-17T09:15:00Z",
    likeCount: 8,
    canReply: true,
    replies: [],
  },
  {
    id: "comment-3",
    videoId: "dQw4w9WgXcQ",
    authorDisplayName: "WebDevExpert",
    authorProfileImageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    textDisplay:
      "The performance optimization section was particularly insightful. I implemented similar techniques in my project and saw a 40% improvement in load times.",
    publishedAt: "2024-01-18T11:30:00Z",
    likeCount: 23,
    canReply: true,
    replies: [],
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getVideo(videoId: string): Promise<Video> {
  await delay(800);
  return mockVideo;
}

export async function updateVideo(
  videoId: string,
  data: VideoUpdateData,
): Promise<Video> {
  await delay(1000);
  return {
    ...mockVideo,
    ...data,
  };
}

export async function getComments(videoId: string): Promise<Comment[]> {
  await delay(600);
  return mockComments;
}

export async function createComment(data: CreateCommentData): Promise<Comment> {
  await delay(700);
  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    videoId: data.videoId,
    authorDisplayName: "My Developer Channel",
    authorProfileImageUrl:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face",
    textDisplay: data.textOriginal,
    publishedAt: new Date().toISOString(),
    likeCount: 0,
    canReply: true,
    replies: [],
  };
  return newComment;
}

export async function createReply(data: CreateReplyData): Promise<Reply> {
  await delay(700);
  const newReply: Reply = {
    id: `reply-${Date.now()}`,
    parentId: data.parentId,
    authorDisplayName: "My Developer Channel",
    authorProfileImageUrl:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face",
    textDisplay: data.textOriginal,
    publishedAt: new Date().toISOString(),
    likeCount: 0,
  };
  return newReply;
}

export async function deleteComment(commentId: string): Promise<void> {
  await delay(500);
  // In a real implementation, this would make an API call to delete the comment
}

export async function deleteReply(replyId: string): Promise<void> {
  await delay(500);
  // In a real implementation, this would make an API call to delete the reply
}
