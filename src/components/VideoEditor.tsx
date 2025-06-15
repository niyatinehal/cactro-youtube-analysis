import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVideo } from "@/lib/youtube-api";
import { logEvent } from "@/lib/database";
import { Video, VideoUpdateData } from "@/types";
import { Save, X, Plus, Loader2 } from "lucide-react";

interface VideoEditorProps {
  video: Video;
}

export const VideoEditor = ({ video }: VideoEditorProps) => {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [privacyStatus, setPrivacyStatus] = useState(video.privacyStatus);
  const [tags, setTags] = useState(video.tags);
  const [newTag, setNewTag] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: VideoUpdateData) => updateVideo(video.id, data),
    onSuccess: (updatedVideo) => {
      queryClient.setQueryData(["video", video.id], updatedVideo);
      setHasChanges(false);
      toast({
        title: "Video updated successfully",
        description: "Your changes have been saved to YouTube.",
      });

      // Log the event
      logEvent({
        action: "video_updated",
        entityType: "video",
        entityId: video.id,
        details: {
          changes: {
            title: title !== video.title ? title : undefined,
            description:
              description !== video.description ? description : undefined,
            privacyStatus:
              privacyStatus !== video.privacyStatus ? privacyStatus : undefined,
            tags:
              JSON.stringify(tags) !== JSON.stringify(video.tags)
                ? tags
                : undefined,
          },
        },
        userId: "user-1",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update video",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: any) => {
    switch (field) {
      case "title":
        setTitle(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "privacyStatus":
        setPrivacyStatus(value);
        break;
    }
    setHasChanges(true);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag("");
      setHasChanges(true);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    setHasChanges(true);
  };

  const handleSave = () => {
    const changes: VideoUpdateData = {};

    if (title !== video.title) changes.title = title;
    if (description !== video.description) changes.description = description;
    if (privacyStatus !== video.privacyStatus)
      changes.privacyStatus = privacyStatus;
    if (JSON.stringify(tags) !== JSON.stringify(video.tags))
      changes.tags = tags;

    if (Object.keys(changes).length > 0) {
      updateMutation.mutate(changes);
    }
  };

  const handleReset = () => {
    setTitle(video.title);
    setDescription(video.description);
    setPrivacyStatus(video.privacyStatus);
    setTags(video.tags);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Edit Video Details</span>
            {hasChanges && (
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200"
              >
                Unsaved changes
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter video title..."
              className="focus-ring"
              maxLength={100}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter video description..."
              className="focus-ring min-h-[120px]"
              maxLength={5000}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description.length}/5000 characters
            </p>
          </div>

          {/* Privacy Status */}
          <div className="space-y-2">
            <Label htmlFor="privacy">Privacy Status</Label>
            <Select
              value={privacyStatus}
              onValueChange={(value) =>
                handleInputChange("privacyStatus", value as any)
              }
            >
              <SelectTrigger className="focus-ring">
                <SelectValue placeholder="Select privacy status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Public</span>
                  </div>
                </SelectItem>
                <SelectItem value="unlisted">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Unlisted</span>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Private</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                className="focus-ring"
                onKeyPress={(e) => e.key === "Enter" && addTag()}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={!newTag.trim() || tags.includes(newTag.trim())}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Press Enter or click + to add a tag
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || updateMutation.isPending}
            >
              Reset Changes
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || updateMutation.isPending}
              className="youtube-button"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {title || "Untitled Video"}
              </h3>
              <div className="flex items-center space-x-2 mb-3">
                <Badge
                  variant="secondary"
                  className={
                    privacyStatus === "public"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : privacyStatus === "unlisted"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }
                >
                  {privacyStatus}
                </Badge>
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-3">
                {description || "No description"}
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
