'use client';

import { useState } from 'react';
import { PricingInputs, PricingResults, RiskAnalysis, StrategicRecommendation, PricingHistory } from '@/types';
import { calculatePricing, analyzeRisk, generateStrategicRecommendations } from '@/lib/calculations/pricing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PricingForm from '@/components/forms/PricingForm';
import ResultsDisplay from '@/components/charts/ResultsDisplay';
// // import RiskAnalysisCard from '@/components/charts/RiskAnalysisCard';
import RecommendationsCard from '@/components/charts/RecommendationsCard';
import HistoryDisplay from '@/components/charts/HistoryDisplay';
import { usePricingHistory } from '@/hooks/usePricingHistory';
import { AlertTriangle, CheckCircle, TrendingUp, BarChart3, XCircle, Calculator, ArrowLeft, History, Plus } from 'lucide-react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'input' | 'results' | 'history'>('input');
  const [pricingInputs, setPricingInputs] = useState<PricingInputs | null>(null);
  const [pricingResults, setPricingResults] = useState<PricingResults | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<StrategicRecommendation[]>([]);
  
  const { addToHistory } = usePricingHistory();

  const handleCalculate = async (inputs: PricingInputs) => {
    // Simular um pequeno delay para mostrar loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Calcular precificação
    const results = calculatePricing(inputs);
    
    // Analisar riscos
    const risk = analyzeRisk(inputs, results);
    
    // Gerar recomendações estratégicas
    const strategicRecs = generateStrategicRecommendations(inputs, results, risk);
    
    // Salvar no histórico usando o hook
    addToHistory(inputs, results, risk, strategicRecs);
    
    // Atualizar estados
    setPricingInputs(inputs);
    setPricingResults(results);
    setRiskAnalysis(risk);
    setRecommendations(strategicRecs);
    setCurrentStep('results');
  };

  const handleNewCalculation = () => {
    setCurrentStep('input');
    setPricingInputs(null);
    setPricingResults(null);
    setRiskAnalysis(null);
    setRecommendations([]);
  };

  const handleLoadHistory = (historyItem: PricingHistory) => {
    setPricingInputs(historyItem.inputs);
    setPricingResults(historyItem.results);
    setRiskAnalysis(historyItem.riskAnalysis);
    setRecommendations(historyItem.recommendations);
    setCurrentStep('results');
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-600';
      case 'low': return 'text-blue-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'excellent': return <CheckCircle className="h-5 w-5" />;
      case 'low': return <TrendingUp className="h-5 w-5" />;
      case 'moderate': return <BarChart3 className="h-5 w-5" />;
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'critical': return <XCircle className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">IntegraPrice</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema inteligente de precificação empresarial com análise de riscos e recomendações estratégicas
          </p>
          
          {/* Navigation */}
          <div className="flex justify-center space-x-4 mt-6">
            <Button
              variant={currentStep === 'input' ? 'default' : 'outline'}
              onClick={() => setCurrentStep('input')}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Análise</span>
            </Button>
            <Button
              variant={currentStep === 'history' ? 'default' : 'outline'}
              onClick={() => setCurrentStep('history')}
              className="flex items-center space-x-2"
            >
              <History className="h-4 w-4" />
              <span>Histórico</span>
            </Button>
          </div>
        </div>

        {currentStep === 'input' ? (
          <PricingForm onCalculate={handleCalculate} />
        ) : currentStep === 'history' ? (
          <HistoryDisplay onLoadHistory={handleLoadHistory} />
        ) : (
          <div className="space-y-6">
            {/* Botão Voltar */}
            <div className="flex justify-start">
              <Button
                variant="outline"
                onClick={handleNewCalculation}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Nova Análise</span>
              </Button>
            </div>

            {/* Resultados */}
            {pricingResults && pricingInputs && (
              <ResultsDisplay 
                results={pricingResults} 
                inputs={pricingInputs} 
              />
            )}

            {/* Análise de Risco */}
            {/* Risk Analysis temporarily disabled */}

            {/* Recomendações */}
            {recommendations.length > 0 && (
              <RecommendationsCard recommendations={recommendations} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

