// Hook for managing template favorites with localStorage persistence
import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'cvgratis-template-favorites';

export interface TemplateFavoritesHook {
  favorites: string[];
  isFavorite: (templateId: string) => boolean;
  toggleFavorite: (templateId: string) => void;
  addFavorite: (templateId: string) => void;
  removeFavorite: (templateId: string) => void;
  clearFavorites: () => void;
}

export function useTemplateFavorites(): TemplateFavoritesHook {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
    return [];
  });

  // Persist favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  const isFavorite = (templateId: string): boolean => {
    return favorites.includes(templateId);
  };

  const addFavorite = (templateId: string) => {
    setFavorites(prev => {
      if (!prev.includes(templateId)) {
        return [...prev, templateId];
      }
      return prev;
    });
  };

  const removeFavorite = (templateId: string) => {
    setFavorites(prev => prev.filter(id => id !== templateId));
  };

  const toggleFavorite = (templateId: string) => {
    if (isFavorite(templateId)) {
      removeFavorite(templateId);
    } else {
      addFavorite(templateId);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites
  };
}
