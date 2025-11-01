import { PricingInputs, PricingResults, RiskAnalysis, RiskLevel, StrategicRecommendation } from '@/types';

/**
 * Calcula o custo total dos custos fixos
 */
export function calculateTotalFixedCosts(fixedCosts: PricingInputs['fixedCosts']): number {
  return fixedCosts.reduce((total, cost) => total + cost.value, 0);
}

/**
 * Calcula o custo variável por unidade
 */
export function calculateVariableCostPerUnit(variableCosts: PricingInputs['variableCosts']): number {
  return variableCosts.reduce((total, cost) => total + cost.valuePerUnit, 0);
}

/**
 * Calcula o percentual total de impostos
 */
export function calculateTotalTaxPercentage(taxes: PricingInputs['taxes']): number {
  return taxes.reduce((total, tax) => total + tax.percentage, 0);
}

/**
 * Calcula o custo fixo por unidade
 */
export function calculateFixedCostPerUnit(totalFixedCosts: number, expectedVolume: number): number {
  if (expectedVolume <= 0) return 0;
  return totalFixedCosts / expectedVolume;
}

/**
 * Calcula o custo total por unidade (fixo + variável)
 */
export function calculateTotalCostPerUnit(fixedCostPerUnit: number, variableCostPerUnit: number): number {
  return fixedCostPerUnit + variableCostPerUnit;
}

/**
 * Calcula o preço mínimo de venda (custo + impostos)
 */
export function calculateMinimumPrice(totalCostPerUnit: number, totalTaxPercentage: number): number {
  const taxMultiplier = 1 + (totalTaxPercentage / 100);
  return totalCostPerUnit * taxMultiplier;
}

/**
 * Calcula o preço ideal com margem desejada
 */
export function calculateIdealPrice(minimumPrice: number, desiredMargin: number): number {
  const marginMultiplier = 1 + (desiredMargin / 100);
  return minimumPrice * marginMultiplier;
}

/**
 * Calcula o ponto de equilíbrio operacional
 */
export function calculateBreakEvenPoint(totalFixedCosts: number, idealPrice: number, variableCostPerUnit: number): number {
  const contributionMargin = idealPrice - variableCostPerUnit;
  if (contributionMargin <= 0) return Infinity;
  return Math.ceil(totalFixedCosts / contributionMargin);
}

/**
 * Calcula a margem real baseada no preço final
 */
export function calculateActualMargin(idealPrice: number, minimumPrice: number): number {
  if (minimumPrice <= 0) return 0;
  return ((idealPrice - minimumPrice) / minimumPrice) * 100;
}

/**
 * Função principal que executa todos os cálculos
 */
export function calculatePricing(inputs: PricingInputs): PricingResults {
  try {
    // Cálculos básicos
    const totalFixedCosts = calculateTotalFixedCosts(inputs.fixedCosts);
    const variableCostPerUnit = calculateVariableCostPerUnit(inputs.variableCosts);
    const totalTaxPercentage = calculateTotalTaxPercentage(inputs.taxes);
    const fixedCostPerUnit = calculateFixedCostPerUnit(totalFixedCosts, inputs.expectedVolume);
    const totalCostPerUnit = calculateTotalCostPerUnit(fixedCostPerUnit, variableCostPerUnit);
    
    // Cálculos de preços
    const minimumPrice = calculateMinimumPrice(totalCostPerUnit, totalTaxPercentage);
    const idealPrice = calculateIdealPrice(minimumPrice, inputs.desiredMargin);
    
    // Cálculos avançados
    const breakEvenPoint = calculateBreakEvenPoint(totalFixedCosts, idealPrice, variableCostPerUnit);
    const actualMargin = calculateActualMargin(idealPrice, minimumPrice);
    
    return {
      unitCost: totalCostPerUnit,
      fixedCostPerUnit,
      variableCostPerUnit,
      totalCostPerUnit,
      minimumPrice,
      idealPrice,
      breakEvenPoint,
      actualMargin,
      totalTaxes: totalTaxPercentage,
    };
  } catch (error) {
    console.error('Erro nos cálculos de precificação:', error);
    throw new Error('Falha ao calcular precificação');
  }
}

/**
 * Analisa o risco do negócio baseado nos resultados
 */
export function analyzeRisk(results: PricingResults, inputs: PricingInputs): RiskAnalysis {
  const factors: string[] = [];
  let score = 100; // Começa com pontuação máxima
  
  // Análise da margem
  if (results.actualMargin < 10) {
    factors.push('Margem muito baixa (< 10%)');
    score -= 30;
  } else if (results.actualMargin < 20) {
    factors.push('Margem baixa (< 20%)');
    score -= 15;
  }
  
  // Análise do ponto de equilíbrio
  if (results.breakEvenPoint > inputs.expectedVolume * 0.8) {
    factors.push('Ponto de equilíbrio muito alto');
    score -= 25;
  } else if (results.breakEvenPoint > inputs.expectedVolume * 0.6) {
    factors.push('Ponto de equilíbrio alto');
    score -= 15;
  }
  
  // Análise da carga tributária
  if (results.totalTaxes > 40) {
    factors.push('Carga tributária muito alta (> 40%)');
    score -= 20;
  } else if (results.totalTaxes > 25) {
    factors.push('Carga tributária alta (> 25%)');
    score -= 10;
  }
  
  // Análise da proporção de custos fixos
  const fixedCostRatio = (results.fixedCostPerUnit / results.totalCostPerUnit) * 100;
  if (fixedCostRatio > 70) {
    factors.push('Custos fixos muito altos (> 70% do total)');
    score -= 20;
  } else if (fixedCostRatio > 50) {
    factors.push('Custos fixos altos (> 50% do total)');
    score -= 10;
  }
  
  // Determina o nível de risco
  let level: RiskLevel;
  if (score >= 80) level = 'excellent';
  else if (score >= 65) level = 'low';
  else if (score >= 50) level = 'moderate';
  else if (score >= 30) level = 'high';
  else level = 'critical';
  
  // Gera recomendações básicas
  const recommendations: string[] = [];
  if (results.actualMargin < 15) {
    recommendations.push('Considere aumentar a margem de lucro');
    recommendations.push('Revise os custos variáveis para otimização');
  }
  if (results.breakEvenPoint > inputs.expectedVolume * 0.7) {
    recommendations.push('Reduza custos fixos ou aumente o volume de vendas');
  }
  if (results.totalTaxes > 30) {
    recommendations.push('Explore alternativas de planejamento tributário');
  }
  
  return {
    level,
    score,
    factors,
    recommendations,
  };
}

/**
 * Gera recomendações estratégicas detalhadas
 */
export function generateStrategicRecommendations(
  results: PricingResults,
  inputs: PricingInputs,
  riskAnalysis: RiskAnalysis
): StrategicRecommendation[] {
  const recommendations: StrategicRecommendation[] = [];
  
  // Recomendações de redução de custos
  if (results.actualMargin < 20) {
    recommendations.push({
      id: 'cost-reduction-1',
      type: 'cost_reduction',
      title: 'Otimização de Custos Variáveis',
      description: 'Negocie melhores preços com fornecedores e otimize processos produtivos para reduzir custos variáveis.',
      impact: 'high',
      effort: 'medium',
      priority: 1,
    });
  }
  
  if (results.fixedCostPerUnit > results.variableCostPerUnit) {
    recommendations.push({
      id: 'cost-reduction-2',
      type: 'cost_reduction',
      title: 'Redução de Custos Fixos',
      description: 'Reavalie contratos de aluguel, renegociação de salários e elimine despesas desnecessárias.',
      impact: 'high',
      effort: 'high',
      priority: 2,
    });
  }
  
  // Recomendações de otimização de processos
  if (results.breakEvenPoint > inputs.expectedVolume * 0.6) {
    recommendations.push({
      id: 'process-optimization-1',
      type: 'process_optimization',
      title: 'Aumento de Produtividade',
      description: 'Implemente melhorias nos processos para aumentar a produtividade e reduzir o ponto de equilíbrio.',
      impact: 'medium',
      effort: 'medium',
      priority: 3,
    });
  }
  
  // Recomendações de posicionamento premium
  if (results.actualMargin > 25 && riskAnalysis.level === 'excellent') {
    recommendations.push({
      id: 'premium-positioning-1',
      type: 'premium_positioning',
      title: 'Estratégia Premium',
      description: 'Considere posicionar o produto como premium, agregando valor e justificando preços mais altos.',
      impact: 'high',
      effort: 'low',
      priority: 4,
    });
  }
  
  return recommendations.sort((a, b) => a.priority - b.priority);
}
