export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  privacyStatus: "public" | "private" | "unlisted";
  tags: string[];
  channelTitle: string;
}

export interface Comment {
  id: string;
  videoId: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textDisplay: string;
  publishedAt: string;
  likeCount: number;
  replies?: Reply[];
  canReply: boolean;
}

export interface Reply {
  id: string;
  parentId: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textDisplay: string;
  publishedAt: string;
  likeCount: number;
}

export interface Note {
  id: string;
  videoId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  priority: "low" | "medium" | "high";
}

export interface EventLog {
  id: string;
  action: string;
  entityType: "video" | "comment" | "note";
  entityId: string;
  details: Record<string, any>;
  timestamp: string;
  userId: string;
}

export interface VideoUpdateData {
  title?: string;
  description?: string;
  tags?: string[];
  privacyStatus?: "public" | "private" | "unlisted";
}

export interface CreateCommentData {
  videoId: string;
  textOriginal: string;
}

export interface CreateReplyData {
  parentId: string;
  textOriginal: string;
}

export interface CreateNoteData {
  videoId: string;
  title: string;
  content: string;
  tags: string[];
  priority: "low" | "medium" | "high";
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
  priority?: "low" | "medium" | "high";
}
