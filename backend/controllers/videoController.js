const Video = require('../models/Video');
const EventLog = require('../models/EventLog');

const getVideo = async (req, res) => {
  const HARDCODED_VIDEO_ID = "Vjm2tRaqFlA";
  try {
    const video = await Video.findOne({ videoId: HARDCODED_VIDEO_ID });
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
};

const updateVideo = async (req, res) => {
  try {
    const HARDCODED_VIDEO_ID = "Vjm2tRaqFlA";
    const video = await Video.findOne({ videoId: HARDCODED_VIDEO_ID });
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const oldData = {
      title: video.title,
      description: video.description,
      privacy_status: video.privacy_status
    };

    video.title = req.body.title || video.title;
    video.description = req.body.description || video.description;
    video.privacy_status = req.body.privacyStatus || video.privacy_status;

    if (req.body.tags) {
      video.tags = req.body.tags;
    }

    await video.save();

    // Log the change
    await EventLog.create({
      action: 'video_updated',
      entityType: 'video',
      entityId: video._id,
      userId: req.body.userId || 'anonymous',
      details: {
        field: 'metadata',
        oldValue: oldData,
        newValue: {
          title: video.title,
          description: video.description,
          privacy_status: video.privacy_status
        }
      }
    });

    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update video' });
  }
};

module.exports = { getVideo, updateVideo };
