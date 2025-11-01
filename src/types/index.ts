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

// Tipos para impostos avançados
export interface Tax {
  id: string;
  name: string;
  percentage: number;
  type: 'federal' | 'state' | 'municipal' | 'other';
  category: 'ICMS' | 'PIS' | 'COFINS' | 'ISS' | 'IPI' | 'CSLL' | 'IRPJ' | 'other';
  isIncluded: boolean; // Se o imposto está incluído no preço final ou é adicional
  calculationBase: 'gross' | 'net' | 'custom'; // Base de cálculo do imposto
  isActive: boolean; // Se o imposto está ativo para este cálculo
  description?: string;
  legalReference?: string; // Referência legal para atualizações automáticas
}

// Configurações específicas de impostos por estado/município
export interface TaxConfiguration {
  state: string;
  municipality?: string;
  taxes: {
    ICMS: number;
    PIS: number;
    COFINS: number;
    ISS?: number;
    IPI?: number;
  };
  lastUpdated: Date;
  source: string; // Fonte da informação tributária
}

// Resultado detalhado dos cálculos de impostos
export interface TaxCalculationResult {
  taxId: string;
  name: string;
  percentage: number;
  calculationBase: number;
  taxAmount: number;
  isIncluded: boolean;
  category: string;
}

// Seção de Faturamento (baseado em metodologia avançada)
export interface RevenueData {
  grossRevenue: number; // Faturamento bruto mensal
  revenueDeductions: {
    returns: number; // Devoluções
    discounts: number; // Descontos
    taxes: {
      pis: number; // PIS sobre faturamento
      cofins: number; // COFINS sobre faturamento
      other: number; // Outros impostos sobre faturamento
    };
  };
  netRevenue: number; // Faturamento líquido
}

// Categorização aprimorada de despesas
export interface ExpenseCategory {
  id: string;
  name: string;
  type: 'fixed' | 'variable';
  items: ExpenseItem[];
  total: number;
}

export interface ExpenseItem {
  id: string;
  description: string;
  value: number;
  isPercentage?: boolean; // Se é percentual do faturamento
  category: string;
}

// Dados de entrada do formulário (expandido)
export interface PricingInputs {
  // Dados básicos do produto
  productName: string;
  expectedVolume: number;
  desiredMargin: number;
  
  // Estrutura de faturamento
  revenueData?: RevenueData;
  
  // Custos e despesas categorizados
  fixedCosts: FixedCost[];
  variableCosts: VariableCost[];
  expenseCategories?: ExpenseCategory[];
  
  // Impostos
  taxes: Tax[];
  
  // Configurações adicionais
  referenceMonth?: string; // Mês de referência para cálculos
  businessType?: 'product' | 'service' | 'mixed';
}

// Resultados dos cálculos (expandido com metodologia avançada)
export interface PricingResults {
  // Custos básicos
  unitCost: number;
  fixedCostPerUnit: number;
  variableCostPerUnit: number;
  totalCostPerUnit: number;
  
  // Preços
  minimumPrice: number;
  idealPrice: number;
  finalPrice: number;
  
  // Análises financeiras
  breakEvenPoint: number;
  actualMargin: number;
  realMargin: number;
  netMargin: number;
  
  // Totais
  totalTaxes: number;
  totalFixedCosts: number;
  totalVariableCosts: number;
  totalRevenue: number;
  totalProfit: number;
  profit: number;
  
  // Análise de faturamento
  revenueAnalysis?: {
    grossRevenue: number;
    netRevenue: number;
    revenueDeductions: number;
    revenueEfficiency: number; // % de eficiência do faturamento
    monthlyProjection: number;
    annualProjection: number;
  };
  
  // Análise de despesas categorizadas
  expenseAnalysis?: {
    totalFixedExpenses: number;
    totalVariableExpenses: number;
    expensesByCategory: Array<{
      category: string;
      total: number;
      percentage: number;
    }>;
    expenseEfficiency: number; // Relação despesas/faturamento
  };
  
  // Informações detalhadas de impostos
  taxCalculations: TaxCalculationResult[];
  totalIncludedTaxes: number;
  totalExcludedTaxes: number;
  priceWithoutTaxes: number;
  priceWithIncludedTaxes: number;
  effectiveTaxRate: number;
  
  // Indicadores de performance
  performanceIndicators?: {
    profitabilityIndex: number; // Índice de lucratividade
    costEfficiencyRatio: number; // Relação custo/receita
    marginSafetyIndex: number; // Margem de segurança
    competitivenessIndex: number; // Índice de competitividade
  };
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
  actionItems?: string[]; // Itens de ação específicos para implementar a recomendação
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

// ===== METODOLOGIA DE PRECIFICAÇÃO ESPECÍFICA =====

// Tipos para metodologia de precificação
export interface CalculationMethod {
  type: 'markup' | 'desired_price';
  productCost: number;
  markup?: number; // Para método markup
  desiredPrice?: number; // Para método preço desejado
}

// Despesas operacionais detalhadas
export interface OperationalExpenses {
  // Despesas Operacionais
  operationalExpenses: {
    energiaEletrica: number;
    materialEscritorio: number;
    materialLimpezaHigiene: number;
    seguranca: number;
    servicosContabeis: number;
    sistemasAdministrativos: number;
    tarifasBancarias: number;
    telefoneInternet: number;
    transportesAdministrativos: number;
    aguaEsgoto: number;
    informatica: number;
    outrosDespesasAdministrativas: number;
    total: number;
  };
  
  // Despesas com Pessoal
  personnelExpenses: {
    fgts: number;
    gps: number;
    proLabore: number;
    salarios: number;
    encargosTrabalhistasPatronais: number;
    total: number;
  };
  
  // Treinamentos, Investimentos e Empréstimos
  investmentsAndLoans: {
    treinamentosInvestimentosEmprestimos: number;
    total: number;
  };
  
  // Total geral de obrigações mensais
  totalMonthlyObligations: number;
}

// Resultado do cálculo de precificação
export interface AdvancedCalculationResult {
  method: 'markup' | 'desired_price';
  
  // Dados de entrada
  productCost: number;
  markup: number;
  
  // Resultados do cálculo
  calculatedPrice: number;
  grossProfit: number;
  grossProfitPercentage: number;
  
  // Deduções e impostos
  deductions: {
    taxes: number;
    taxesPercentage: number;
    commissionPlatform: number;
    commissionPlatformPercentage: number;
    marketingPercentage: number;
    marketingValue: number;
    salesCommission: number;
    salesCommissionPercentage: number;
    otherDeductions: number;
    otherDeductionsPercentage: number;
    totalDeductions: number;
    totalDeductionsPercentage: number;
  };
  
  // Margem de contribuição
  contributionMargin: number;
  contributionMarginPercentage: number;
  
  // Despesas operacionais
  operationalExpenses: OperationalExpenses;
}

// Input completo para cálculo de precificação
export interface AdvancedPricingInputs {
  productName: string;
  calculationMethod: CalculationMethod;
  operationalExpenses: OperationalExpenses;
  
  // Configurações de deduções
  deductionSettings: {
    taxesPercentage: number;
    commissionPlatformPercentage: number;
    marketingPercentage: number;
    salesCommissionPercentage: number;
    otherDeductionsPercentage: number;
  };
}

// Tipos para formulário básico
export interface BasicFormData {
  productName: string;
  productCost: number;
  desiredMargin: number;
  category?: string;
}

// Resultado dos cálculos básicos
export interface BasicCalculationResult {
  sellingPrice: number;
  profit: number;
  marginPercentage: number;
  productCost: number;
}
