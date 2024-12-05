import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ModalContextType {
  isModalOpen: boolean;
  activeDay: number | null;
  showWelcomeModal: boolean;
  openModal: (day: number) => void;
  closeModal: () => void;
  setShowWelcomeModal: (show: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const location = useLocation();

  // Check if it's the first visit when not on /welcome route
  useEffect(() => {
    if (location.pathname !== '/welcome') {
      const hasChosenMusic = localStorage.getItem('musicPreference');
      if (hasChosenMusic === null) {
        setShowWelcomeModal(true);
      }
    }
  }, [location]);

  const openModal = (day: number) => {
    setActiveDay(day);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveDay(null);
  };

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        activeDay,
        showWelcomeModal,
        openModal,
        closeModal,
        setShowWelcomeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
