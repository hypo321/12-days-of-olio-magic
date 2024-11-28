# 12 Days of Olio Magic 🎄✨

A festive interactive advent calendar celebrating the magic of the holiday season with Olio, bringing together community, sustainability, and joy through code.

## ✨ About

This project is a creative coding adventure that combines the spirit of the "12 Days of Christmas" with Olio's mission of sharing and reducing waste. Each day brings a new magical feature or enhancement to help spread holiday cheer while making a positive impact on our communities and environment.

## 🎯 Features

### Core Functionality
- **Interactive Calendar Interface** 📅
  - 12 beautifully animated doors
  - Responsive grid layout
  - Smooth animations and transitions
  - Touch-optimized for mobile devices

- **Rich Content Display** 🎥
  - Daily content reveals with various media types
  - Privacy-focused YouTube video integration
  - Animated statistics displays
  - Inspiring quotes with attribution

- **Smart Navigation** 🚀
  - Intuitive zoom functionality
  - Swipe gestures for mobile
  - Modal-based content presentation
  - Direct URL access to specific days

- **Progressive Enhancement** 📱
  - Mobile-first responsive design
  - Touch and mouse input support
  - Elegant loading states
  - Smooth animations

## 🛠 Technical Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Animation**: Framer Motion
- **Build Tool**: Vite
- **Deployment**: Vercel

## 🏗 Architecture

### Key Components
1. `Calendar.tsx`
   - Calendar grid management
   - Window positioning
   - Door state management

2. `CalendarWindow.tsx`
   - Individual door interactions
   - Touch/click handling
   - Animation management

3. `DayContent.tsx`
   - Content rendering
   - Media handling
   - YouTube integration

4. `ContentModal.tsx`
   - Modal presentation
   - Content zooming
   - Gesture handling

### State Management
- React Context for modal state
- URL-based routing
- Local component state
- Stateless design (no persistence)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Generate optimized images (if needed)
npm run generate-images
```

### Build and Preview
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

### Manual Testing Checklist
1. **Door Interactions**
   - Opening/closing animations
   - Touch gestures
   - Zoom transitions

2. **Content Display**
   - Image loading
   - Video playback
   - Stats and quotes

3. **Responsive Design**
   - Mobile (portrait/landscape)
   - Tablet
   - Desktop

4. **Browser Support**
   - Chrome
   - Safari
   - Firefox
   - Mobile browsers

## 🔒 Privacy & Security

### Video Embedding
- youtube-nocookie.com domain
- Minimal iframe permissions
- Strict referrer policy
- Disabled tracking

### Data Handling
- No user data collection
- No cookies required
- No external tracking
- Local-only state

## 📁 Project Structure
```
12-days-of-olio-magic/
├── public/           # Static assets
├── src/
│   ├── components/  # React components
│   ├── contexts/    # React contexts
│   ├── types/      # TypeScript definitions
│   ├── utils/      # Utility functions
│   └── constants/  # App constants
├── scripts/        # Build scripts
└── vercel.json     # Deployment config
```

## ⚡️ Performance Optimizations

1. **Image Optimization**
   - Thumbnail generation
   - Lazy loading
   - Format optimization

2. **Code Splitting**
   - Route-based splitting
   - Component lazy loading
   - Module chunking

3. **Animation Performance**
   - Hardware acceleration
   - RAF-based animations
   - Transform optimizations

## 🤝 Contributing

Contributions are welcome! Feel free to submit pull requests or open issues to discuss new features or improvements.

## 📝 License

[Add your preferred license]

---

Built with ❤️ by the Olio team
