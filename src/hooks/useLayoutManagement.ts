import { useState, useEffect, useCallback } from 'react';
import { Panel } from './usePanelManagement';

const HEADER_HEIGHT = 50;

export const useLayoutManagement = () => {
  const [savedLayouts, setSavedLayouts] = useState<{ [key: string]: Panel[] }>({});
  const [layoutName, setLayoutName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mythoras-layouts');
    if (saved) {
      try {
        setSavedLayouts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved layouts:', e);
      }
    }
  }, []);

  const saveLayoutsToStorage = useCallback((layouts: { [key: string]: Panel[] }) => {
    localStorage.setItem('mythoras-layouts', JSON.stringify(layouts));
    setSavedLayouts(layouts);
  }, []);

  const saveLayout = useCallback((panels: Panel[]) => {
    if (!layoutName.trim()) return;
    const newLayouts = { ...savedLayouts, [layoutName]: [...panels] };
    saveLayoutsToStorage(newLayouts);
    setLayoutName('');
    setShowSaveDialog(false);
  }, [layoutName, savedLayouts, saveLayoutsToStorage]);

  const loadLayout = useCallback((name: string) => {
    if (savedLayouts[name]) {
      setShowLoadDialog(false);
      return savedLayouts[name];
    }
    return null;
  }, [savedLayouts]);

  const resetLayout = useCallback((): Panel[] => {
    return [
      { 
        id: 'main-game', 
        type: 'gameview', 
        x: 20, 
        y: HEADER_HEIGHT + 20, 
        width: 800, 
        height: 450, 
        title: 'Game View',
        locked: true
      },
      { 
        id: 'squad-ribbon', 
        type: 'squad', 
        x: 20, 
        y: HEADER_HEIGHT + 490, 
        width: 600, 
        height: 120, 
        title: 'Squad',
        locked: true
      }
    ];
  }, []);

  return {
    savedLayouts,
    layoutName,
    showSaveDialog,
    showLoadDialog,
    setLayoutName,
    setShowSaveDialog,
    setShowLoadDialog,
    saveLayout,
    loadLayout,
    resetLayout
  };
};