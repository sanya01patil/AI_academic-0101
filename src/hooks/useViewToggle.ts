import { useViewStore } from '../store/view';

export const useViewToggle = () => {
  const { view, setView, toggleView } = useViewStore();
  
  return {
    isTeaching: view === 'teaching',
    isAdmin: view === 'admin',
    currentView: view,
    setView,
    toggleView
  };
};
