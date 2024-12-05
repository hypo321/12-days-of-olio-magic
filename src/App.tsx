import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { Calendar } from './components/Calendar';
import { Helmet } from 'react-helmet-async';
import { ModalProvider } from './contexts/ModalContext';
import { WelcomeModal } from './components/WelcomeModal';
import { BackgroundMusic } from './components/BackgroundMusic';
import { ScreenEffect } from './components/ScreenEffect';
import { ContentModal } from './components/ContentModal';
import { useModal } from './contexts/ModalContext';

const CalendarRoute = () => {
  const { day } = useParams();
  const { openModal } = useModal();

  useEffect(() => {
    if (day) {
      const dayNumber = parseInt(day, 10);
      if (!isNaN(dayNumber)) {
        openModal(dayNumber);
      }
    }
  }, [day, openModal]);

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
              content={`https://12-days-of-olio-magic.vercel.app/day/${day}`}
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
              content={`https://12-days-of-olio-magic.vercel.app/images/og/day${day}.jpg`}
            />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:url"
              content={`https://12-days-of-olio-magic.vercel.app/day/${day}`}
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
              name="twitter:image"
              content={`https://12-days-of-olio-magic.vercel.app/images/og/day${day}.jpg`}
            />

            <link
              rel="canonical"
              href={`https://12-days-of-olio-magic.vercel.app/day/${day}`}
            />
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
            <meta
              property="og:url"
              content="https://12-days-of-olio-magic.vercel.app"
            />
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
              content="https://12-days-of-olio-magic.vercel.app/images/og/main.jpg"
            />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:url"
              content="https://12-days-of-olio-magic.vercel.app"
            />
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
              content="https://12-days-of-olio-magic.vercel.app/images/og/main.jpg"
            />

            <link
              rel="canonical"
              href="https://12-days-of-olio-magic.vercel.app"
            />
          </>
        )}
      </Helmet>
      <Calendar />
    </>
  );
};

const AppContent = () => {
  const { isModalOpen, activeDay, closeModal } = useModal();
  const location = useLocation();
  const navigate = useNavigate();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);

  useEffect(() => {
    const hasChosenMusic = localStorage.getItem('musicPreference');
    if (location.pathname === '/welcome') {
      setShowWelcomeModal(true);
    } else if (hasChosenMusic === null) {
      setShowWelcomeModal(true);
    } else {
      setMusicEnabled(hasChosenMusic === 'true');
    }
  }, [location.pathname]);

  const handleMusicChoice = (enable: boolean) => {
    localStorage.setItem('musicPreference', enable.toString());
    setMusicEnabled(enable);
    setShowWelcomeModal(false);
    if (location.pathname === '/welcome') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      <ScreenEffect effect="confetti" />
      
      <main className="relative">
        <Routes>
          <Route path="/" element={<CalendarRoute />} />
          <Route path="/day/:day" element={<CalendarRoute />} />
        </Routes>
      </main>

      {activeDay !== null && (
        <ContentModal
          isOpen={isModalOpen}
          day={activeDay}
          onClose={closeModal}
        />
      )}

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
    </div>
  );
};

function App() {
  return (
    <Router
      basename={
        process.env.NODE_ENV === 'production'
          ? '/12-days-of-olio-magic'
          : '/'
      }
      future={{
        v7_startTransition: true
      }}
    >
      <ModalProvider>
        <Routes>
          <Route path="/welcome" element={<AppContent />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </ModalProvider>
    </Router>
  );
}

export default App;
