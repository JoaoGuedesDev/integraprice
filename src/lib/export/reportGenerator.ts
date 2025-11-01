import { PricingResults, PricingInputs, RiskAnalysis, StrategicRecommendation } from '@/types';

export interface ReportData {
  productName: string;
  inputs: PricingInputs;
  results: PricingResults;
  riskAnalysis: RiskAnalysis | null;
  recommendations: StrategicRecommendation[];
  generatedAt: Date;
  companyInfo?: {
    name: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

export interface ExportOptions {
  format: 'pdf' | 'excel';
  includeCharts: boolean;
  includeRecommendations: boolean;
  includeRiskAnalysis: boolean;
  includeTaxBreakdown: boolean;
  template: 'standard' | 'detailed' | 'executive';
}

// Função para formatar valores monetários
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Função para formatar percentuais
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

// Função para formatar datas
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Função para gerar dados estruturados do relatório
export const generateReportData = (
  productName: string,
  inputs: PricingInputs,
  results: PricingResults,
  riskAnalysis: RiskAnalysis | null,
  recommendations: StrategicRecommendation[],
  companyInfo?: ReportData['companyInfo']
): ReportData => {
  return {
    productName,
    inputs,
    results,
    riskAnalysis,
    recommendations,
    generatedAt: new Date(),
    companyInfo
  };
};

// Função para calcular métricas adicionais para o relatório
export const calculateReportMetrics = (results: PricingResults) => {
  const roi = ((results.totalProfit / results.totalRevenue) * 100);
  const breakEvenUnits = Math.ceil(results.totalFixedCosts / (results.idealPrice - results.variableCostPerUnit));
  const profitMarginPercentage = (results.actualMargin / 100);
  const taxBurden = (results.totalTaxes / results.finalPrice) * 100;

  return {
    roi: roi || 0,
    breakEvenUnits,
    profitMarginPercentage,
    taxBurden,
    priceCompetitiveness: calculatePriceCompetitiveness(results),
    costEfficiency: calculateCostEfficiency(results)
  };
};

// Função para calcular competitividade de preço
const calculatePriceCompetitiveness = (results: PricingResults): 'high' | 'medium' | 'low' => {
  const marginRatio = results.actualMargin / 100;
  
  if (marginRatio > 0.3) return 'high';
  if (marginRatio > 0.15) return 'medium';
  return 'low';
};

// Função para calcular eficiência de custos
const calculateCostEfficiency = (results: PricingResults): 'excellent' | 'good' | 'average' | 'poor' => {
  const costRatio = results.totalCostPerUnit / results.finalPrice;
  
  if (costRatio < 0.5) return 'excellent';
  if (costRatio < 0.7) return 'good';
  if (costRatio < 0.85) return 'average';
  return 'poor';
};

// Função para gerar resumo executivo
export const generateExecutiveSummary = (data: ReportData) => {
  const metrics = calculateReportMetrics(data.results);
  
  return {
    title: `Análise de Precificação - ${data.productName}`,
    keyFindings: [
      `Preço final recomendado: ${formatCurrency(data.results.finalPrice)}`,
      `Margem de lucro: ${formatPercentage(data.results.actualMargin)}`,
      `Ponto de equilíbrio: ${metrics.breakEvenUnits} unidades`,
      `Carga tributária: ${formatPercentage(metrics.taxBurden)}`,
      `Nível de risco: ${data.riskAnalysis?.level?.toUpperCase() || 'N/A'}`
    ],
    recommendations: data.recommendations.slice(0, 3).map(rec => rec.title),
    riskLevel: data.riskAnalysis?.level || 'unknown',
    profitability: metrics.roi > 20 ? 'Alta' : metrics.roi > 10 ? 'Média' : 'Baixa'
  };
};

// Função para validar dados antes da exportação
export const validateReportData = (data: ReportData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.productName || data.productName.trim() === '') {
    errors.push('Nome do produto é obrigatório');
  }

  if (!data.results || typeof data.results.finalPrice !== 'number') {
    errors.push('Resultados de precificação inválidos');
  }

  if (data.results.finalPrice <= 0) {
    errors.push('Preço final deve ser maior que zero');
  }

  if (!data.inputs.fixedCosts || data.inputs.fixedCosts.length === 0) {
    errors.push('Pelo menos um custo fixo deve ser informado');
  }

  if (!data.inputs.variableCosts || data.inputs.variableCosts.length === 0) {
    errors.push('Pelo menos um custo variável deve ser informado');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Função para preparar dados para gráficos
export const prepareChartData = (results: PricingResults, inputs: PricingInputs) => {
  return {
    costBreakdown: [
      { name: 'Custos Fixos', value: results.fixedCostPerUnit, color: '#ef4444' },
      { name: 'Custos Variáveis', value: results.variableCostPerUnit, color: '#f97316' },
      { name: 'Impostos', value: results.totalTaxes / (inputs.expectedVolume || 1), color: '#eab308' },
      { name: 'Margem de Lucro', value: results.profit / (inputs.expectedVolume || 1), color: '#22c55e' }
    ],
    taxBreakdown: results.taxCalculations?.map(tax => ({
      name: tax.name,
      value: tax.taxAmount,
      percentage: tax.percentage,
      isIncluded: tax.isIncluded
    })) || [],
    profitAnalysis: {
      revenue: results.totalRevenue,
      costs: results.totalFixedCosts + results.totalVariableCosts,
      taxes: results.totalTaxes,
      profit: results.totalProfit
    }
  };
};