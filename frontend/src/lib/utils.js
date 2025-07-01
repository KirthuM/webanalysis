// src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Theme utility functions
export const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

export const getGradeColor = (grade) => {
  if (['A+', 'A'].includes(grade)) {
    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
  }
  if (['B+', 'B'].includes(grade)) {
    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
  }
  return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
};
