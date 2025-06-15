const Comment = require('../models/Comment');
const Reply = require('../models/Reply');

const getComments = async (req, res) => {
  const { videoId } = req.params;
  try {
    const comments = await Comment.find({ videoId }).sort({ createdAt: -1 });
    const replies = await Reply.find({ parent_id: { $in: comments.map(c => c._id) } });

    // Attach replies to their parent comment
    const repliesByParent = replies.reduce((acc, reply) => {
      const parentId = reply.parent_id.toString();
      acc[parentId] = acc[parentId] || [];
      acc[parentId].push(reply);
      return acc;
    }, {});

    const result = comments.map(comment => ({
      ...comment.toObject(),
      replies: repliesByParent[comment._id.toString()] || []
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

const createComment = async (req, res) => {
  const { videoId } = req.params;
  const { author_display_name, author_profile_image_url, text_display } = req.body;

  try {
    const newComment = await Comment.create({
      videoId,
      author_display_name,
      author_profile_image_url,
      text_display,
      published_at: new Date(),
      like_count: 0,
    });
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    await Comment.findByIdAndDelete(commentId);
    await Reply.deleteMany({ parent_id: commentId });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

const createReply = async (req, res) => {
  const { commentId } = req.params;
  const { author_display_name, author_profile_image_url, text_display } = req.body;

  try {
    const newReply = await Reply.create({
      parent_id: commentId,
      author_display_name,
      author_profile_image_url,
      text_display,
      published_at: new Date(),
      like_count: 0,
    });
    res.status(201).json(newReply);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create reply' });
  }
};

const deleteReply = async (req, res) => {
  const { replyId } = req.params;
  try {
    await Reply.findByIdAndDelete(replyId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete reply' });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
  createReply,
  deleteReply
};
