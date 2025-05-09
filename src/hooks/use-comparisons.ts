"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Comparison, ComparisonItem, ComparisonFeature } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is installed or install it: npm install uuid @types/uuid

const LOCAL_STORAGE_KEY = 'seoContentForgeComparisons';

export function useComparisons() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedComparisons = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedComparisons) {
        setComparisons(JSON.parse(storedComparisons));
      }
    } catch (error) {
      console.error("Failed to load comparisons from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const saveComparisons = useCallback((updatedComparisons: Comparison[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedComparisons));
      setComparisons(updatedComparisons);
    } catch (error) {
      console.error("Failed to save comparisons to localStorage", error);
    }
  }, []);

  const addComparison = (newComparisonData: Omit<Comparison, 'id' | 'createdAt' | 'items'> & { items: Array<Omit<ComparisonItem, 'id' | 'features'> & { features: Array<Omit<ComparisonFeature, 'id'>> }> }) => {
    const newComparison: Comparison = {
      ...newComparisonData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      items: newComparisonData.items.map(item => ({
        ...item,
        id: uuidv4(),
        features: item.features.map(feature => ({
          ...feature,
          id: uuidv4(),
        })),
      })),
    };
    saveComparisons([...comparisons, newComparison]);
    return newComparison;
  };

  const getComparisonById = (id: string): Comparison | undefined => {
    return comparisons.find(comp => comp.id === id);
  };

  const updateComparison = (id: string, updatedData: Partial<Omit<Comparison, 'id' | 'createdAt'>>) => {
    const updatedComparisons = comparisons.map(comp =>
      comp.id === id ? { ...comp, ...updatedData, items: (updatedData.items || comp.items).map(item => ({...item, id: item.id || uuidv4(), features: item.features.map(f => ({...f, id: f.id || uuidv4()}))})) } : comp
    );
    saveComparisons(updatedComparisons);
  };
  
  const deleteComparison = (id: string) => {
    const filteredComparisons = comparisons.filter(comp => comp.id !== id);
    saveComparisons(filteredComparisons);
  };

  return {
    comparisons,
    isLoading,
    addComparison,
    getComparisonById,
    updateComparison,
    deleteComparison,
  };
}
