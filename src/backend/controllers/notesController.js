const Note = require('../models/Note');

const getNotes = async (req, res) => {
  const { videoId } = req.params;
  const { search = '', tags = '' } = req.query;
  const tagList = tags ? tags.split(',') : [];

  try {
    const query = { videoId };
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') }
      ];
    }
    if (tagList.length) {
      query.tags = { $in: tagList };
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

const getTags = async (req, res) => {
  const { videoId } = req.params;
  try {
    const notes = await Note.find({ videoId });
    const tagSet = new Set();
    notes.forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    res.json([...tagSet]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

const createNote = async (req, res) => {
  const { videoId } = req.params;
  const { title, content, tags = [], priority = 'medium' } = req.body;

  try {
    const newNote = await Note.create({ videoId, title, content, tags, priority });
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note' });
  }
};

const updateNote = async (req, res) => {
  const { noteId } = req.params;
  try {
    const updated = await Note.findByIdAndUpdate(noteId, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
};

const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  try {
    await Note.findByIdAndDelete(noteId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

module.exports = {
  getNotes,
  getTags,
  createNote,
  updateNote,
  deleteNote
};
