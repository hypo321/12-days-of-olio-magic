import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  isModalOpen: boolean;
  activeDay: number | null;
  openModal: (day: number) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const openModal = (day: number) => {
    setActiveDay(day);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Don't clear activeDay here - let the Calendar component handle it
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, activeDay, openModal, closeModal }}>
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
