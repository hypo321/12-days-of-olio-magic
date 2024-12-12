import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Calendar } from './components/Calendar';
import { Helmet } from 'react-helmet-async';
import { ModalProvider } from './contexts/ModalContext';
import { ContentModal } from './components/ContentModal';
import { useModal } from './contexts/ModalContext';
import { BackgroundMusic } from './components/BackgroundMusic';
import { WelcomeModal } from './components/WelcomeModal';
import { useState } from 'react';
import { ShareIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { ShareModal } from './components/ShareModal';

// Get the base URL dynamically
const baseUrl = 'https://12days.olioapp.com';

const CalendarRoute = () => {
  return (
    <>
      <Helmet>
        <title>The 12 Days of Olio Magic</title>
        <meta name="title" content="The 12 Days of Olio Magic" />
        <meta
          name="description"
          content="Join us for a magical journey through 12 days of Olio surprises. Open the doors to celebrate 2024 with us!"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl} />
        <meta
          property="og:title"
          content="The 12 Days of Olio Magic"
        />
        <meta
          property="og:description"
          content="Join us for a magical journey through 12 days of Olio surprises. Open the doors to celebrate 2024 with us!"
        />
        <meta
          property="og:image"
          content={`${baseUrl}/images/og/main.jpg`}
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={baseUrl} />
        <meta
          name="twitter:title"
          content="The 12 Days of Olio Magic"
        />
        <meta
          name="twitter:description"
          content="Join us for a magical journey through 12 days of Olio surprises. Open the doors to celebrate 2024 with us!"
        />
        <meta
          name="twitter:image"
          content={`${baseUrl}/images/og/main.jpg`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="canonical" href={baseUrl} />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Y3Q7CYY4RJ"
        />
        <script>
          {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-Y3Q7CYY4RJ', {
                  'cookie_flags': 'SameSite=None;Secure'
                });
              `}
        </script>
      </Helmet>
      <Calendar />
    </>
  );
};

const AppContent = () => {
  const { isModalOpen, activeDay, closeModal } = useModal();

  return (
    <div className="min-h-screen conic-gradient">
      <Routes>
        <Route path="/" element={<CalendarRoute />} />
        <Route path="/day/:day" element={<CalendarRoute />} />
        <Route path="*" element={<CalendarRoute />} />
      </Routes>
      {activeDay !== null && (
        <ContentModal
          isOpen={isModalOpen}
          day={activeDay}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

function App() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMusicChoice = (enable: boolean) => {
    setMusicEnabled(enable);
    setShowWelcomeModal(false);
  };

  return (
    <ModalProvider>
      <div className="relative min-h-screen">
        <div className="fixed inset-0 z-0 pointer-events-none"></div>
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <motion.button
            initial={{ opacity: 0.6, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShareModal(true)}
            className="rounded-full bg-pink-700/70 hover:bg-pink-700/90 p-2 text-white transition-colors"
            title="Share"
          >
            <ShareIcon className="w-8 h-8" />
          </motion.button>
        </div>
        <WelcomeModal
          isOpen={showWelcomeModal}
          onClose={() => {
            setShowWelcomeModal(false);
            if (location.pathname === '/welcome') {
              navigate('/');
            }
          }}
          onMusicChoice={handleMusicChoice}
        />
        <BackgroundMusic
          fileName="ES_A Wishful Night - Martin Landstrom.mp3"
          volume={0.2}
          initiallyEnabled={musicEnabled}
        />
        <main className="relative">
          <Routes>
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </main>
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      </div>
    </ModalProvider>
  );
}

export default function Root() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </Router>
  );
}
