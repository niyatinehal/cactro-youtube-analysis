import { Note, EventLog, CreateNoteData, UpdateNoteData } from "@/types";

// Mock data for demonstration
let mockNotes: Note[] = [
  {
    id: "note-1",
    videoId: "dQw4w9WgXcQ",
    title: "Video Improvement Ideas",
    content:
      "Consider adding more visual examples in the TypeScript section. Maybe include a diagram showing the component hierarchy.",
    tags: ["improvement", "visuals", "typescript"],
    createdAt: "2024-01-16T16:30:00Z",
    updatedAt: "2024-01-16T16:30:00Z",
    priority: "medium",
  },
  {
    id: "note-2",
    videoId: "dQw4w9WgXcQ",
    title: "Follow-up Video Topics",
    content:
      "Based on comments, create videos on:\n- Advanced deployment strategies\n- Testing best practices\n- Performance monitoring",
    tags: ["follow-up", "content-ideas"],
    createdAt: "2024-01-17T10:15:00Z",
    updatedAt: "2024-01-17T10:15:00Z",
    priority: "high",
  },
  {
    id: "note-3",
    videoId: "dQw4w9WgXcQ",
    title: "Technical Issues to Address",
    content:
      "Audio quality drops slightly around the 8-minute mark. Need to check microphone settings for future recordings.",
    tags: ["technical", "audio", "quality"],
    createdAt: "2024-01-18T14:20:00Z",
    updatedAt: "2024-01-18T14:20:00Z",
    priority: "low",
  },
];

let mockEventLogs: EventLog[] = [
  {
    id: "event-1",
    action: "video_updated",
    entityType: "video",
    entityId: "dQw4w9WgXcQ",
    details: {
      field: "title",
      oldValue: "Old Title",
      newValue: "My Amazing Video Tutorial",
    },
    timestamp: "2024-01-15T10:30:00Z",
    userId: "user-1",
  },
  {
    id: "event-2",
    action: "comment_created",
    entityType: "comment",
    entityId: "comment-1",
    details: { videoId: "dQw4w9WgXcQ", author: "TechEnthusiast" },
    timestamp: "2024-01-16T14:20:00Z",
    userId: "user-1",
  },
  {
    id: "event-3",
    action: "note_created",
    entityType: "note",
    entityId: "note-1",
    details: { title: "Video Improvement Ideas", priority: "medium" },
    timestamp: "2024-01-16T16:30:00Z",
    userId: "user-1",
  },
];

// Simulate database delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getNotes(
  videoId: string,
  searchQuery?: string,
  tags?: string[],
): Promise<Note[]> {
  await delay(400);

  let filteredNotes = mockNotes.filter((note) => note.videoId === videoId);

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredNotes = filteredNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query),
    );
  }

  if (tags && tags.length > 0) {
    filteredNotes = filteredNotes.filter((note) =>
      tags.some((tag) => note.tags.includes(tag)),
    );
  }

  return filteredNotes.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function createNote(data: CreateNoteData): Promise<Note> {
  await delay(500);

  const newNote: Note = {
    id: `note-${Date.now()}`,
    videoId: data.videoId,
    title: data.title,
    content: data.content,
    tags: data.tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: data.priority,
  };

  mockNotes.push(newNote);

  // Log the event
  await logEvent({
    action: "note_created",
    entityType: "note",
    entityId: newNote.id,
    details: { title: newNote.title, priority: newNote.priority },
    userId: "user-1",
  });

  return newNote;
}

export async function updateNote(
  noteId: string,
  data: UpdateNoteData,
): Promise<Note> {
  await delay(500);

  const noteIndex = mockNotes.findIndex((note) => note.id === noteId);
  if (noteIndex === -1) {
    throw new Error("Note not found");
  }

  const updatedNote = {
    ...mockNotes[noteIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockNotes[noteIndex] = updatedNote;

  // Log the event
  await logEvent({
    action: "note_updated",
    entityType: "note",
    entityId: noteId,
    details: { changes: data },
    userId: "user-1",
  });

  return updatedNote;
}

export async function deleteNote(noteId: string): Promise<void> {
  await delay(400);

  const noteIndex = mockNotes.findIndex((note) => note.id === noteId);
  if (noteIndex === -1) {
    throw new Error("Note not found");
  }

  const deletedNote = mockNotes[noteIndex];
  mockNotes.splice(noteIndex, 1);

  // Log the event
  await logEvent({
    action: "note_deleted",
    entityType: "note",
    entityId: noteId,
    details: { title: deletedNote.title },
    userId: "user-1",
  });
}

export async function getAllTags(videoId: string): Promise<string[]> {
  await delay(200);

  const notes = mockNotes.filter((note) => note.videoId === videoId);
  const allTags = notes.flatMap((note) => note.tags);
  return [...new Set(allTags)].sort();
}

export async function logEvent(
  event: Omit<EventLog, "id" | "timestamp">,
): Promise<void> {
  await delay(100);

  const newEvent: EventLog = {
    ...event,
    id: `event-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  mockEventLogs.push(newEvent);
}

export async function getEventLogs(limit: number = 50): Promise<EventLog[]> {
  await delay(300);

  return mockEventLogs
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, limit);
}
