# ISHREALM TV - Watch Together Platform

A modern, responsive web application for creating synchronized watch parties with friends. Stream content from YouTube, Twitch, and local files while chatting in real-time.

![ISHREALM TV](https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0cmUlMjBjaW5lbWF8ZW58MXx8fHwxNzYxNTMwMDkxfDA&ixlib=rb-4.1.0&q=80&w=1080)

## ✨ Features

### 🎬 Multi-Platform Support
- **YouTube**: Embed and sync YouTube videos
- **Twitch**: Watch Twitch streams together
- **Local Files**: Upload and host your own videos
- **Hosted Content**: Stream from any video URL

### 🎯 Core Functionality
- **Real-time Sync**: Synchronized playback across all participants
- **Instant Rooms**: Create rooms with unique codes (ISH-XXXXXX format)
- **Guest Mode**: Join without account (90 minutes free per day)
- **Host Controls**: Full playback control for room creators
- **Live Chat**: Real-time messaging with emoji reactions
- **Mobile Optimized**: Responsive design for all devices

### 🎨 Modern UI/UX
- **Dark Theme**: Cinema-inspired dark interface
- **Gradient Accents**: Pink and green gradient branding
- **Glass Morphism**: Backdrop blur effects throughout
- **Smooth Animations**: Polished interactions and transitions
- **Touch Optimized**: Mobile-first design approach

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IshrealmTV
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
IshrealmTV/
├── App.tsx                 # Main application component
├── components/
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   ├── HomePage.tsx       # Landing page with platform selection
│   ├── CreateRoom.tsx     # Room creation interface
│   ├── JoinRoom.tsx      # Room joining interface
│   ├── WatchParty.tsx    # Main watch party interface
│   ├── VideoPlayer.tsx   # Video player component
│   ├── ChatBox.tsx       # Real-time chat component
│   ├── RoomControls.tsx  # Host playback controls
│   ├── Navbar.tsx        # Navigation component
│   └── YouTubeDownloader.tsx # Video downloader (demo)
├── styles/
│   └── globals.css       # Global styles and CSS variables
├── guidelines/
│   └── Guidelines.md     # Development guidelines
└── Attributions.md       # Third-party attributions
```

## 🎮 How to Use

### Creating a Room
1. Click **"Create Room"** on the homepage
2. Select your platform (YouTube, Twitch, Local File, or Hosted)
3. Enter the video URL or upload a file
4. Enter your name as the host
5. Share the generated room code with friends

### Joining a Room
1. Click **"Join Room"** on the homepage
2. Enter the room code (ISH-XXXXXX format)
3. Enter your name
4. Start watching and chatting!

### Host Controls
- **Play/Pause**: Control playback for all viewers
- **Seek**: Jump to any point in the video
- **Volume**: Adjust audio levels
- **Sync**: All changes sync in real-time

## 🛠️ Technical Details

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **State Management**: React useState hooks

### Key Components

#### App.tsx
- Main application state management
- View routing and room state
- Background effects and layout

#### VideoPlayer.tsx
- Handles multiple video platforms
- YouTube/Twitch iframe embedding
- Local file video playback
- Sync indicators and host controls

#### WatchParty.tsx
- Main watch party interface
- Responsive layout (mobile/desktop)
- Participant management
- Chat integration

#### ChatBox.tsx
- Real-time messaging interface
- Emoji reactions with animations
- Message formatting and timestamps
- Mobile-optimized input

### Design System

#### Color Palette
- **Primary**: Pink (#ec4899) to Green (#10b981) gradients
- **Background**: Black with transparency overlays
- **Text**: White with opacity variations
- **Accents**: Platform-specific colors (Red for YouTube, Purple for Twitch)

#### Typography
- **Headings**: Gradient text effects
- **Body**: Clean, readable fonts
- **Code**: Monospace for room codes

#### Components
- **Cards**: Glass morphism with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Inputs**: Dark theme with subtle borders
- **Modals**: Full-screen overlays on mobile

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for React best practices
- **Prettier**: Code formatting (if configured)
- **Component Structure**: Functional components with hooks

### Adding New Features
1. Create component in `components/` directory
2. Add to main App.tsx routing
3. Update TypeScript interfaces as needed
4. Follow existing design patterns

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

## 📱 Mobile Features

- **Touch Optimized**: Large touch targets
- **Responsive Layout**: Adapts to screen size
- **Mobile Menu**: Collapsible navigation
- **Gesture Support**: Swipe and tap interactions
- **Performance**: Optimized for mobile devices

## 🔮 Future Enhancements

### Planned Features
- **User Accounts**: Registration and authentication
- **Room History**: Save and revisit previous rooms
- **Screen Sharing**: Share your screen with participants
- **Voice Chat**: Audio communication during watch parties
- **Playlists**: Queue multiple videos
- **Moderation**: Host controls for chat and participants

### Backend Integration
- **Real-time Sync**: WebSocket connections for true sync
- **User Management**: Database for user accounts
- **File Storage**: Cloud storage for uploaded videos
- **Analytics**: Usage tracking and insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add TypeScript types for new features
- Test on multiple devices and browsers
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui**: Beautiful UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide**: Consistent icon library
- **Unsplash**: High-quality background images
- **React Team**: Amazing framework and ecosystem

## 📞 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Contact: [Your Contact Information]

---

**Made with ❤️ by SONOAAC**

*Stream anything. Watch together.*
