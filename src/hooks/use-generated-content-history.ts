
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { GeneratedHistoryItem, NewGeneratedHistoryItemData } from '@/lib/history-types';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'seoContentForgeGeneratedHistory';

export function useGeneratedContentHistory() {
  const [history, setHistory] = useState<GeneratedHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHistory) {
        // Sort by timestamp descending (newest first)
        const parsedHistory: GeneratedHistoryItem[] = JSON.parse(storedHistory);
        parsedHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to load generated content history from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const saveHistory = useCallback((updatedHistory: GeneratedHistoryItem[]) => {
    try {
      // Ensure newest items are first for storage, though we sort on load.
      updatedHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error)
 {
      console.error("Failed to save generated content history to localStorage", error);
    }
  }, []);

  const addHistoryItem = (itemData: NewGeneratedHistoryItemData) => {
    const newItem: GeneratedHistoryItem = {
      ...itemData,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    const updatedHistory = [newItem, ...history];
    saveHistory(updatedHistory);
    return newItem;
  };
  
  const deleteHistoryItem = (id: string) => {
    const filteredHistory = history.filter(item => item.id !== id);
    saveHistory(filteredHistory);
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  return {
    history,
    isLoading,
    addHistoryItem,
    deleteHistoryItem,
    clearHistory,
  };
}
