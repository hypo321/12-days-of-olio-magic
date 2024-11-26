import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Calendar } from './components/Calendar';
import { Helmet } from 'react-helmet-async';
import { ModalProvider } from './contexts/ModalContext';
import { ContentModal } from './components/ContentModal';
import { useModal } from './contexts/ModalContext';

const CalendarRoute = () => {
  const { day } = useParams();
  
  return (
    <>
      <Helmet>
        {day ? (
          <>
            <title>The 12 Days of Olio Magic - Day {day}</title>
            <meta name="title" content={`The 12 Days of Olio Magic - Day ${day}`} />
            <meta name="description" content={`Discover what's behind Door #${day} in our magical Olio advent calendar! `} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://12-days-of-olio-magic.vercel.app/day/${day}`} />
            <meta property="og:title" content={`The 12 Days of Olio Magic - Day ${day}`} />
            <meta property="og:description" content={`Discover what's behind Door #${day} in our magical Olio advent calendar! `} />
            <meta property="og:image" content={`https://12-days-of-olio-magic.vercel.app/images/og/day${day}.jpg`} />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={`https://12-days-of-olio-magic.vercel.app/day/${day}`} />
            <meta name="twitter:title" content={`The 12 Days of Olio Magic - Day ${day}`} />
            <meta name="twitter:description" content={`Discover what's behind Door #${day} in our magical Olio advent calendar! `} />
            <meta name="twitter:image" content={`https://12-days-of-olio-magic.vercel.app/images/og/day${day}.jpg`} />
            
            <link rel="canonical" href={`https://12-days-of-olio-magic.vercel.app/day/${day}`} />
          </>
        ) : (
          <>
            <title>The 12 Days of Olio Magic</title>
            <meta name="title" content="The 12 Days of Olio Magic" />
            <meta name="description" content="Join us for 12 days of magical surprises in our interactive advent calendar! Each day brings a new festive delight. " />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://12-days-of-olio-magic.vercel.app/" />
            <meta property="og:title" content="The 12 Days of Olio Magic" />
            <meta property="og:description" content="Join us for 12 days of magical surprises in our interactive advent calendar! Each day brings a new festive delight. " />
            <meta property="og:image" content="https://12-days-of-olio-magic.vercel.app/images/og/main.jpg" />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content="https://12-days-of-olio-magic.vercel.app/" />
            <meta name="twitter:title" content="The 12 Days of Olio Magic" />
            <meta name="twitter:description" content="Join us for 12 days of magical surprises in our interactive advent calendar! Each day brings a new festive delight. " />
            <meta name="twitter:image" content="https://12-days-of-olio-magic.vercel.app/images/og/main.jpg" />
            
            <link rel="canonical" href="https://12-days-of-olio-magic.vercel.app/" />
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
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-green-100">
      <Routes>
        <Route path="/" element={<CalendarRoute />} />
        <Route path="/day/:day" element={<CalendarRoute />} />
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
  return (
    <Router>
      <ModalProvider>
        <AppContent />
      </ModalProvider>
    </Router>
  );
}

export default App;
