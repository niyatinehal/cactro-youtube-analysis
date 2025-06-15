import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  ExternalLink,
  Share2,
  Download,
  Clock,
  Tag,
  Youtube,
} from "lucide-react";
import { Video } from "@/types";

interface VideoDetailsProps {
  video: Video;
}

export const VideoDetails = ({ video }: VideoDetailsProps) => {
  const formatDuration = (duration: string) => {
    // Parse ISO 8601 duration format (PT15M32S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;

    const hours = parseInt(match[1] || "0");
    const minutes = parseInt(match[2] || "0");
    const seconds = parseInt(match[3] || "0");

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getYouTubeUrl = () => `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Video Preview */}
      <div className="lg:col-span-2">
        <Card className="dashboard-card">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <Button size="lg" className="youtube-button">
                  <Play className="h-6 w-6 mr-2" />
                  Watch on YouTube
                </Button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                {formatDuration(video.duration)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Info */}
        <Card className="dashboard-card mt-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{video.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <Youtube className="h-4 w-4 mr-1" />
                    {video.channelTitle}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(video.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(getYouTubeUrl(), "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {video.description}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag) => (
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

      {/* Video Stats Sidebar */}
      <div className="space-y-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg">Video Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {video.viewCount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Views
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {video.likeCount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Likes
                </p>
              </div>
            </div>

            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {video.commentCount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comments
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <Badge
                  variant="secondary"
                  className={
                    video.privacyStatus === "public"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : video.privacyStatus === "unlisted"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }
                >
                  {video.privacyStatus}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Duration:
                </span>
                <span className="font-medium">
                  {formatDuration(video.duration)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Published:
                </span>
                <span className="font-medium">
                  {new Date(video.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Analytics
            </Button>
            <Button className="w-full youtube-button">
              <Youtube className="h-4 w-4 mr-2" />
              Open in YouTube Studio
            </Button>
            <Button className="w-full" variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Video
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
