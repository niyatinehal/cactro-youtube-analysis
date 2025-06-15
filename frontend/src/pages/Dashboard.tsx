// @ts-nocheck
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VideoDetails } from "@/components/VideoDetails";
import { CommentsSection } from "@/components/CommentsSection";
import { NotesSection } from "@/components/NotesSection";
import { VideoEditor } from "@/components/VideoEditor";
import {
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Settings,
  BarChart3,
  FileText,
  Youtube,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getVideo } from "@/lib/youtube-api";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const videoId = "Vjm2tRaqFlA";

  const {
    data: video,
    isLoading,
    error,
    
  } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideo(videoId),
  });

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num?.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-4 border-b-2 border-youtube-red mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your video dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Youtube className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Failed to load video data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-youtube-red rounded-lg">
              <Youtube className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Video Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your YouTube content
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            >
              {/* {video.privacy_status} */}
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: <Eye className="h-5 w-5 text-blue-600" />,
              label: "Views",
              value: formatNumber(video.views),
              bg: "bg-blue-100",
            },
            {
              icon: <ThumbsUp className="h-5 w-5 text-green-600" />,
              label: "Likes",
              value: formatNumber(video.likes),
              bg: "bg-green-100",
            },
            {
              icon: <MessageCircle className="h-5 w-5 text-purple-600" />,
              label: "Comments",
              value: formatNumber(video.comments),
              bg: "bg-purple-100",
            },
            {
              icon: <Calendar className="h-5 w-5 text-orange-600" />,
              label: "Published",
              value: formatDate(video.publishedAt),
              bg: "bg-orange-100",
            },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex space-x-3 items-center">
                <div className={`p-2 rounded-lg ${stat.bg}`}>{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview"><BarChart3 className="h-4 w-4 mr-1" />Overview</TabsTrigger>
            <TabsTrigger value="edit"><Settings className="h-4 w-4 mr-1" />Edit</TabsTrigger>
            <TabsTrigger value="comments"><MessageCircle className="h-4 w-4 mr-1" />Comments</TabsTrigger>
            <TabsTrigger value="notes"><FileText className="h-4 w-4 mr-1" />Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <VideoDetails video={video} />
          </TabsContent>

          <TabsContent value="edit">
            <VideoEditor video={video} />
          </TabsContent>

          <TabsContent value="comments">
            <CommentsSection videoId={video.id} />
          </TabsContent>

          <TabsContent value="notes">
            <NotesSection videoId={video.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
