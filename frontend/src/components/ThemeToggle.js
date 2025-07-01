// src/components/ThemeToggle.js
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 group"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300 group-hover:rotate-180" />
      ) : (
        <Moon className="w-5 h-5 text-blue-400 transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
