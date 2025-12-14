import { useEffect } from 'react';

export default function TabTitle() {
  useEffect(() => {
    const originalTitle = document.title;
    const blurTitle = "Don't leave me... 💔";

    const handleVisibility = () => {
      document.title = document.hidden ? blurTitle : originalTitle;
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return null; // Logic only component
}