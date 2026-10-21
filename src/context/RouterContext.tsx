import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextValue {
  currentPath: string;
  navigate: (path: string) => void;
  isConsultationModalOpen: boolean;
  openConsultationModal: (initialService?: string) => void;
  closeConsultationModal: () => void;
  consultationService?: string;
}

const RouterContext = createContext<RouterContextValue>({
  currentPath: '/',
  navigate: () => {},
  isConsultationModalOpen: false,
  openConsultationModal: () => {},
  closeConsultationModal: () => {}
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultationService, setConsultationService] = useState<string | undefined>();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string) => {
    const fullCurrent = window.location.pathname + window.location.search;
    if (fullCurrent !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const openConsultationModal = useCallback((initialService?: string) => {
    setConsultationService(initialService);
    setIsConsultationModalOpen(true);
  }, []);

  const closeConsultationModal = useCallback(() => {
    setIsConsultationModalOpen(false);
  }, []);

  return (
    <RouterContext.Provider
      value={{
        currentPath,
        navigate,
        isConsultationModalOpen,
        openConsultationModal,
        closeConsultationModal,
        consultationService
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);
