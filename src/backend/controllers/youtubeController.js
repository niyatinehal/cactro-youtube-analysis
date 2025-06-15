const axios = require('axios');

const getVideoDetails = async (req, res) => {
  const { videoId } = req.params;
  const apiKey = process.env.YOUTUBE_API_KEY;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails,status&id=${videoId}&key=${apiKey}`
    );

    const video = response.data.items[0];

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const parseDuration = (iso) => {
      const match = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      const [hours, minutes, seconds] = [
        match[1] ? parseInt(match[1]) : 0,
        match[2] ? parseInt(match[2]) : 0,
        match[3] ? parseInt(match[3]) : 0,
      ];
      return `${hours ? hours + ':' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const data = {
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url,
      publishedAt: video.snippet.publishedAt,
      views: video.statistics.viewCount,
      likes: video.statistics.likeCount,
      comments: video.statistics.commentCount,
      status: video.status.privacyStatus,
      duration: parseDuration(video.contentDetails.duration),
      videoUrl: `https://www.youtube.com/watch?v=${video.id}`
    };

    res.json(data);
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch video details' });
  }
};

module.exports = { getVideoDetails };
