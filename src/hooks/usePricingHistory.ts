'use client';

import { useState, useEffect } from 'react';
import { PricingHistory, PricingInputs, PricingResults, RiskAnalysis, StrategicRecommendation } from '@/types';

const STORAGE_KEY = 'integraprice_history';

export function usePricingHistory() {
  const [history, setHistory] = useState<PricingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar histórico do localStorage na inicialização
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar no localStorage sempre que o histórico mudar
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Erro ao salvar histórico:', error);
      }
    }
  }, [history, isLoading]);

  const addToHistory = (
    inputs: PricingInputs,
    results: PricingResults,
    riskAnalysis: RiskAnalysis,
    recommendations: StrategicRecommendation[]
  ) => {
    const newEntry: PricingHistory = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      inputs,
      results,
      riskAnalysis,
      recommendations,
    };

    setHistory(prev => [newEntry, ...prev].slice(0, 50)); // Manter apenas os últimos 50 registros
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getHistoryById = (id: string) => {
    return history.find(entry => entry.id === id);
  };

  const getHistoryByProduct = (productName: string) => {
    return history.filter(entry => 
      entry.inputs.productName.toLowerCase().includes(productName.toLowerCase())
    );
  };

  const getRecentHistory = (limit: number = 10) => {
    return history.slice(0, limit);
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = integraprice_history_.json;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importHistory = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedData)) {
            setHistory(importedData);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error('Erro ao importar histórico:', error);
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  };

  return {
    history,
    isLoading,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryById,
    getHistoryByProduct,
    getRecentHistory,
    exportHistory,
    importHistory,
  };
}
