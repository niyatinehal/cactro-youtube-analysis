const express = require('express');
const router = express.Router();
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getTags
} = require('../controllers/notesController');

// GET /videos/:videoId/notes?search=&tags=
router.get('/:videoId/notes', getNotes);

// GET /videos/:videoId/notes/tags
router.get('/:videoId/notes/tags', getTags);

// POST /videos/:videoId/notes
router.post('/:videoId/notes', createNote);

// PUT /notes/:noteId
router.put('/notes/:noteId', updateNote);

// DELETE /notes/:noteId
router.delete('/notes/:noteId', deleteNote);

module.exports = router;
