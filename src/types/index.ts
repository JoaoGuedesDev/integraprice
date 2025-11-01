// Tipos para custos fixos
export interface FixedCost {
  id: string;
  name: string;
  value: number;
  category: 'rent' | 'salaries' | 'utilities' | 'insurance' | 'other';
}

// Tipos para custos variáveis
export interface VariableCost {
  id: string;
  name: string;
  valuePerUnit: number;
  category: 'materials' | 'labor' | 'packaging' | 'shipping' | 'other';
}

// Tipos para impostos
export interface Tax {
  id: string;
  name: string;
  percentage: number;
  type: 'federal' | 'state' | 'municipal' | 'other';
}

// Dados de entrada do formulário
export interface PricingInputs {
  fixedCosts: FixedCost[];
  variableCosts: VariableCost[];
  taxes: Tax[];
  desiredMargin: number;
  expectedVolume: number;
  productName: string;
}

// Resultados dos cálculos
export interface PricingResults {
  unitCost: number;
  fixedCostPerUnit: number;
  variableCostPerUnit: number;
  totalCostPerUnit: number;
  minimumPrice: number;
  idealPrice: number;
  breakEvenPoint: number;
  actualMargin: number;
  totalTaxes: number;
}

// Análise de risco
export type RiskLevel = 'critical' | 'high' | 'moderate' | 'low' | 'excellent';

export interface RiskAnalysis {
  level: RiskLevel;
  score: number;
  factors: string[];
  recommendations: string[];
}

// Recomendações estratégicas
export interface StrategicRecommendation {
  id: string;
  type: 'cost_reduction' | 'process_optimization' | 'premium_positioning';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  priority: number;
}

// Histórico de análises
export interface PricingHistory {
  id: string;
  date: Date;
  productName: string;
  inputs: PricingInputs;
  results: PricingResults;
  riskAnalysis: RiskAnalysis;
  recommendations: StrategicRecommendation[];
}

// Dados para gráficos
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

// Configurações do sistema
export interface SystemSettings {
  currency: string;
  locale: string;
  defaultMargin: number;
  riskThresholds: {
    critical: number;
    high: number;
    moderate: number;
    low: number;
  };
}
