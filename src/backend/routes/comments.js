const express = require('express');
const router = express.Router();
const {
  getComments,
  createComment,
  deleteComment,
  createReply,
  deleteReply
} = require('../controllers/commentsController');

// Comments
router.get('/:videoId/comments', getComments);
router.post('/:videoId/comments', createComment);
router.delete('/comments/:commentId', deleteComment);

// Replies
router.post('/comments/:commentId/replies', createReply);
router.delete('/replies/:replyId', deleteReply);

module.exports = router;
