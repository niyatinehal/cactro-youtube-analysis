# YouTube Video Management Dashboard

A modern, production-ready dashboard for managing YouTube videos with comprehensive features for content creators.

## Features

- **Video Management**: View detailed video statistics, edit titles, descriptions, and privacy settings
- **Comment System**: View, reply to, and manage comments on your videos
- **Notes System**: Create, edit, and organize notes about your videos with tagging and search functionality
- **Event Logging**: Track all actions and changes for audit purposes
- **Real-time Updates**: Live updates for all video interactions
- **Responsive Design**: Beautiful, modern interface that works on all devices

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: TanStack Query for server state
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS animations

## API Endpoints

### Video Management

```typescript
// Get video details
GET /api/videos/{videoId}
Response: Video

// Update video metadata
PUT /api/videos/{videoId}
Body: VideoUpdateData
Response: Video

// Example video update
{
  "title": "Updated Video Title",
  "description": "New description",
  "privacyStatus": "unlisted",
  "tags": ["tutorial", "web-dev"]
}
```

### Comments Management

```typescript
// Get video comments
GET /api/videos/{videoId}/comments
Response: Comment[]

// Create new comment
POST /api/videos/{videoId}/comments
Body: CreateCommentData
Response: Comment

// Create reply to comment
POST /api/comments/{commentId}/replies
Body: CreateReplyData
Response: Reply

// Delete comment
DELETE /api/comments/{commentId}
Response: void

// Delete reply
DELETE /api/replies/{replyId}
Response: void

// Example comment creation
{
  "videoId": "dQw4w9WgXcQ",
  "textOriginal": "Great tutorial! Very helpful."
}

// Example reply creation
{
  "parentId": "comment-123",
  "textOriginal": "Thank you for the feedback!"
}
```

### Notes Management

```typescript
// Get notes for a video
GET /api/videos/{videoId}/notes?search={query}&tags={tags}
Response: Note[]

// Create new note
POST /api/videos/{videoId}/notes
Body: CreateNoteData
Response: Note

// Update note
PUT /api/notes/{noteId}
Body: UpdateNoteData
Response: Note

// Delete note
DELETE /api/notes/{noteId}
Response: void

// Get available tags
GET /api/videos/{videoId}/notes/tags
Response: string[]

// Example note creation
{
  "videoId": "dQw4w9WgXcQ",
  "title": "Video Improvement Ideas",
  "content": "Add more visual examples in the TypeScript section.",
  "tags": ["improvement", "typescript"],
  "priority": "medium"
}
```

### Event Logging

```typescript
// Get event logs
GET /api/events?limit={limit}
Response: EventLog[]

// Log event (internal)
POST /api/events
Body: Omit<EventLog, "id" | "timestamp">
Response: void

// Example event log
{
  "action": "video_updated",
  "entityType": "video",
  "entityId": "dQw4w9WgXcQ",
  "details": {
    "field": "title",
    "oldValue": "Old Title",
    "newValue": "New Title"
  },
  "userId": "user-123"
}
```

## Database Schema

### Videos Table

```sql
CREATE TABLE videos (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(500),
  published_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  duration VARCHAR(50),
  privacy_status ENUM('public', 'private', 'unlisted') DEFAULT 'private',
  channel_title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Video Tags Table

```sql
CREATE TABLE video_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  video_id VARCHAR(255) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_video_tag (video_id, tag)
);
```

### Comments Table

```sql
CREATE TABLE comments (
  id VARCHAR(255) PRIMARY KEY,
  video_id VARCHAR(255) NOT NULL,
  author_display_name VARCHAR(255) NOT NULL,
  author_profile_image_url VARCHAR(500),
  text_display TEXT NOT NULL,
  published_at TIMESTAMP,
  like_count INTEGER DEFAULT 0,
  can_reply BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);
```

### Replies Table

```sql
CREATE TABLE replies (
  id VARCHAR(255) PRIMARY KEY,
  parent_id VARCHAR(255) NOT NULL,
  author_display_name VARCHAR(255) NOT NULL,
  author_profile_image_url VARCHAR(500),
  text_display TEXT NOT NULL,
  published_at TIMESTAMP,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);
```

### Notes Table

```sql
CREATE TABLE notes (
  id VARCHAR(255) PRIMARY KEY,
  video_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);
```

### Note Tags Table

```sql
CREATE TABLE note_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  note_id VARCHAR(255) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_note_tag (note_id, tag)
);
```

### Event Logs Table

```sql
CREATE TABLE event_logs (
  id VARCHAR(255) PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  entity_type ENUM('video', 'comment', 'note') NOT NULL,
  entity_id VARCHAR(255) NOT NULL,
  details JSON,
  user_id VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_user (user_id),
  INDEX idx_timestamp (timestamp)
);
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- YouTube API credentials (for production)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd youtube-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
# YouTube API Configuration
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_YOUTUBE_CLIENT_ID=your_oauth_client_id

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/youtube_dashboard

# Application Configuration
VITE_APP_URL=http://localhost:5173
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run format.fix` - Format code with Prettier

## Deployment

The application is designed to be deployed on modern platforms like Vercel, Netlify, or Cloudflare Pages.

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Configure environment variables in Vercel dashboard

### Environment-Specific Configuration

- **Production**: Configure real YouTube API endpoints
- **Staging**: Use test data and sandbox APIs
- **Development**: Use mock data (current implementation)

## Architecture

The application follows a modern React architecture with:

- **Component-based design**: Reusable, composable components
- **Type safety**: Full TypeScript coverage
- **State management**: TanStack Query for server state
- **Design system**: Consistent UI with Tailwind CSS
- **Responsive design**: Mobile-first approach
- **Performance**: Optimized with React 18 features

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation above

## Roadmap

- [ ] Real YouTube API integration
- [ ] User authentication and authorization
- [ ] Advanced analytics and insights
- [ ] Video upload functionality
- [ ] Bulk operations for comments and notes
- [ ] Export functionality for notes and analytics
- [ ] Mobile app companion
- [ ] Team collaboration features
