import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
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
import { SnowEffect } from './components/SnowEffect';
import { useState } from 'react';

// Get the base URL dynamically
const baseUrl =
  import.meta.env.VERCEL_URL || 'https://oliopaulmckenna.github.io';

const CalendarRoute = () => {
  const { day } = useParams();

  return (
    <>
      <Helmet>
        {day ? (
          <>
            <title>The 12 Days of Olio Magic - Day {day}</title>
            <meta
              name="title"
              content={`The 12 Days of Olio Magic - Day ${day}`}
            />
            <meta
              name="description"
              content={`Discover what's behind Door #${day} in our magical Olio advent calendar! `}
            />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta
              property="og:url"
              content={`${baseUrl}/day/${day}`}
            />
            <meta
              property="og:title"
              content={`The 12 Days of Olio Magic - Day ${day}`}
            />
            <meta
              property="og:description"
              content={`Discover what's behind Door #${day} in our magical Olio advent calendar! `}
            />
            <meta
              property="og:image"
              content={`${baseUrl}/images/og/day${day}.jpg`}
            />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:url"
              content={`${baseUrl}/day/${day}`}
            />
            <meta
              name="twitter:title"
              content={`The 12 Days of Olio Magic - Day ${day}`}
            />
            <meta
              name="twitter:description"
              content={`Discover what's behind Door #${day} in our magical Olio advent calendar! `}
            />
            <meta
              property="twitter:image"
              content={`${baseUrl}/images/og/day${day}.jpg`}
            />

            <link rel="canonical" href={`${baseUrl}/day/${day}`} />
          </>
        ) : (
          <>
            <title>The 12 Days of Olio Magic</title>
            <meta name="title" content="The 12 Days of Olio Magic" />
            <meta
              name="description"
              content="Join us for a magical journey through 12 days of Olio surprises! Open a new door each day to discover something special."
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
              content="Join us for a magical journey through 12 days of Olio surprises! Open a new door each day to discover something special."
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
              content="Join us for a magical journey through 12 days of Olio surprises! Open a new door each day to discover something special."
            />
            <meta
              name="twitter:image"
              content={`${baseUrl}/images/og/main.jpg`}
            />

            <link rel="canonical" href={baseUrl} />
          </>
        )}
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
  const [musicEnabled, setMusicEnabled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMusicChoice = (enable: boolean) => {
    //localStorage.setItem('musicPreference', enable.toString());
    setMusicEnabled(enable);
    setShowWelcomeModal(false);
  };

  return (
    <ModalProvider>
      <div className="relative min-h-screen">
        <div className="fixed inset-0 z-0 pointer-events-none">
          {import.meta.env.VITE_ENABLE_SNOW_EFFECT !== 'false' && (
            <SnowEffect />
          )}
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
      </div>
    </ModalProvider>
  );
}

export default function Root() {
  return (
    <Router
      future={{
        v7_startTransition: true,
      }}
    >
      <App />
    </Router>
  );
}
