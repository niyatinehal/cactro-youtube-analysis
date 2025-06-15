import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getComments,
  createComment,
  createReply,
  deleteComment,
  deleteReply,
} from "@/lib/youtube-api";
import { logEvent } from "@/lib/database";
import { Comment, Reply } from "@/types";
import {
  MessageCircle,
  Send,
  ThumbsUp,
  MoreVertical,
  Trash2,
  Reply as ReplyIcon,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommentsSectionProps {
  videoId: string;
}

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [showReplyForm, setShowReplyForm] = useState<Record<string, boolean>>(
    {},
  );
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [deleteReplyId, setDeleteReplyId] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: comments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => getComments(videoId),
  });

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      queryClient.setQueryData(["comments", videoId], (old: Comment[] = []) => [
        newComment,
        ...old,
      ]);
      setNewComment("");
      toast({
        title: "Comment posted",
        description: "Your comment has been added to the video.",
      });

      // Log the event
      logEvent({
        action: "comment_created",
        entityType: "comment",
        entityId: newComment.id,
        details: { videoId, text: newComment.textDisplay },
        userId: "user-1",
      });
    },
    onError: () => {
      toast({
        title: "Failed to post comment",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: createReply,
    onSuccess: (newReply, variables) => {
      queryClient.setQueryData(["comments", videoId], (old: Comment[] = []) =>
        old.map((comment) =>
          comment.id === variables.parentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), newReply],
              }
            : comment,
        ),
      );
      setReplyTexts((prev) => ({ ...prev, [variables.parentId]: "" }));
      setShowReplyForm((prev) => ({ ...prev, [variables.parentId]: false }));
      toast({
        title: "Reply posted",
        description: "Your reply has been added to the comment.",
      });

      // Log the event
      logEvent({
        action: "reply_created",
        entityType: "comment",
        entityId: newReply.id,
        details: { parentId: variables.parentId, text: newReply.textDisplay },
        userId: "user-1",
      });
    },
    onError: () => {
      toast({
        title: "Failed to post reply",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, commentId) => {
      queryClient.setQueryData(["comments", videoId], (old: Comment[] = []) =>
        old.filter((comment) => comment.id !== commentId),
      );
      toast({
        title: "Comment deleted",
        description: "The comment has been removed.",
      });

      // Log the event
      logEvent({
        action: "comment_deleted",
        entityType: "comment",
        entityId: commentId,
        details: { videoId },
        userId: "user-1",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete comment",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const deleteReplyMutation = useMutation({
    mutationFn: deleteReply,
    onSuccess: (_, replyId) => {
      queryClient.setQueryData(["comments", videoId], (old: Comment[] = []) =>
        old.map((comment) => ({
          ...comment,
          replies:
            comment.replies?.filter((reply) => reply.id !== replyId) || [],
        })),
      );
      toast({
        title: "Reply deleted",
        description: "The reply has been removed.",
      });

      // Log the event
      logEvent({
        action: "reply_deleted",
        entityType: "comment",
        entityId: replyId,
        details: { videoId },
        userId: "user-1",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete reply",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handlePostComment = () => {
    if (!newComment.trim()) return;

    createCommentMutation.mutate({
      videoId,
      textOriginal: newComment,
    });
  };

  const handlePostReply = (commentId: string) => {
    const replyText = replyTexts[commentId];
    if (!replyText?.trim()) return;

    createReplyMutation.mutate({
      parentId: commentId,
      textOriginal: replyText,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const CommentItem = ({ comment }: { comment: Comment }) => (
    <div className="space-y-3">
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.authorProfileImageUrl} />
          <AvatarFallback>
            {comment.authorDisplayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="font-medium text-sm">{comment.authorDisplayName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.publishedAt)}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setDeleteCommentId(comment.id)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {comment.textDisplay}
          </p>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <ThumbsUp className="h-3 w-3 mr-1" />
              {comment.likeCount > 0 ? comment.likeCount : ""}
            </Button>
            {comment.canReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() =>
                  setShowReplyForm((prev) => ({
                    ...prev,
                    [comment.id]: !prev[comment.id],
                  }))
                }
              >
                <ReplyIcon className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm[comment.id] && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyTexts[comment.id] || ""}
                onChange={(e) =>
                  setReplyTexts((prev) => ({
                    ...prev,
                    [comment.id]: e.target.value,
                  }))
                }
                className="min-h-[80px] focus-ring"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handlePostReply(comment.id)}
                  disabled={
                    !replyTexts[comment.id]?.trim() ||
                    createReplyMutation.isPending
                  }
                  className="youtube-button"
                >
                  {createReplyMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3 w-3 mr-1" />
                      Reply
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setShowReplyForm((prev) => ({
                      ...prev,
                      [comment.id]: false,
                    }))
                  }
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
              {comment.replies.map((reply) => (
                <ReplyItem key={reply.id} reply={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ReplyItem = ({ reply }: { reply: Reply }) => (
    <div className="flex space-x-3">
      <Avatar className="h-6 w-6">
        <AvatarImage src={reply.authorProfileImageUrl} />
        <AvatarFallback>
          {reply.authorDisplayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-sm">{reply.authorDisplayName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(reply.publishedAt)}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setDeleteReplyId(reply.id)}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
          {reply.textDisplay}
        </p>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">
            <ThumbsUp className="h-3 w-3 mr-1" />
            {reply.likeCount > 0 ? reply.likeCount : ""}
          </Button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Card className="dashboard-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading comments...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="dashboard-card">
        <CardContent className="p-6">
          <div className="text-center py-8 text-red-600 dark:text-red-400">
            Failed to load comments. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* New Comment Form */}
          <div className="space-y-3">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] focus-ring"
            />
            <div className="flex justify-end">
              <Button
                onClick={handlePostComment}
                disabled={!newComment.trim() || createCommentMutation.isPending}
                className="youtube-button"
              >
                {createCommentMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Comment Dialog */}
      <AlertDialog
        open={!!deleteCommentId}
        onOpenChange={() => setDeleteCommentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteCommentId) {
                  deleteCommentMutation.mutate(deleteCommentId);
                  setDeleteCommentId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Reply Dialog */}
      <AlertDialog
        open={!!deleteReplyId}
        onOpenChange={() => setDeleteReplyId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reply</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reply? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteReplyId) {
                  deleteReplyMutation.mutate(deleteReplyId);
                  setDeleteReplyId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
