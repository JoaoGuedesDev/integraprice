import { 
  AdvancedPricingInputs, 
  AdvancedCalculationResult, 
  CalculationMethod,
  OperationalExpenses 
} from '@/types';

/**
 * Calcula preço usando metodologia avançada - Método Markup
 */
export function calculateByMarkup(
  productCost: number,
  markup: number,
  deductionSettings: any
): AdvancedCalculationResult {
  // Preço calculado = Custo do Produto × Markup
  const calculatedPrice = productCost * markup;
  
  // Lucro bruto = Preço - Custo
  const grossProfit = calculatedPrice - productCost;
  const grossProfitPercentage = (grossProfit / calculatedPrice) * 100;
  
  // Cálculo das deduções
  const deductions = {
    taxes: calculatedPrice * (deductionSettings.taxesPercentage / 100),
    taxesPercentage: deductionSettings.taxesPercentage,
    commissionPlatform: calculatedPrice * (deductionSettings.commissionPlatformPercentage / 100),
    commissionPlatformPercentage: deductionSettings.commissionPlatformPercentage,
    marketingValue: calculatedPrice * (deductionSettings.marketingPercentage / 100),
    marketingPercentage: deductionSettings.marketingPercentage,
    salesCommission: calculatedPrice * (deductionSettings.salesCommissionPercentage / 100),
    salesCommissionPercentage: deductionSettings.salesCommissionPercentage,
    otherDeductions: calculatedPrice * (deductionSettings.otherDeductionsPercentage / 100),
    otherDeductionsPercentage: deductionSettings.otherDeductionsPercentage,
    totalDeductions: 0,
    totalDeductionsPercentage: 0
  };
  
  // Total de deduções
  deductions.totalDeductions = deductions.taxes + deductions.commissionPlatform + 
    deductions.marketingValue + deductions.salesCommission + deductions.otherDeductions;
  deductions.totalDeductionsPercentage = (deductions.totalDeductions / calculatedPrice) * 100;
  
  // Margem de contribuição = Preço - Custo - Deduções
  const contributionMargin = calculatedPrice - productCost - deductions.totalDeductions;
  const contributionMarginPercentage = (contributionMargin / calculatedPrice) * 100;
  
  return {
    method: 'markup',
    productCost,
    markup,
    calculatedPrice,
    grossProfit,
    grossProfitPercentage,
    deductions,
    contributionMargin,
    contributionMarginPercentage,
    operationalExpenses: createEmptyOperationalExpenses()
  };
}

/**
 * Calcula markup usando metodologia avançada - Método Preço Desejado
 */
export function calculateByDesiredPrice(
  productCost: number,
  desiredPrice: number,
  deductionSettings: any
): AdvancedCalculationResult {
  // Markup calculado = Preço Desejado ÷ Custo do Produto
  const markup = desiredPrice / productCost;
  
  // Lucro bruto = Preço - Custo
  const grossProfit = desiredPrice - productCost;
  const grossProfitPercentage = (grossProfit / desiredPrice) * 100;
  
  // Cálculo das deduções
  const deductions = {
    taxes: desiredPrice * (deductionSettings.taxesPercentage / 100),
    taxesPercentage: deductionSettings.taxesPercentage,
    commissionPlatform: desiredPrice * (deductionSettings.commissionPlatformPercentage / 100),
    commissionPlatformPercentage: deductionSettings.commissionPlatformPercentage,
    marketingValue: desiredPrice * (deductionSettings.marketingPercentage / 100),
    marketingPercentage: deductionSettings.marketingPercentage,
    salesCommission: desiredPrice * (deductionSettings.salesCommissionPercentage / 100),
    salesCommissionPercentage: deductionSettings.salesCommissionPercentage,
    otherDeductions: desiredPrice * (deductionSettings.otherDeductionsPercentage / 100),
    otherDeductionsPercentage: deductionSettings.otherDeductionsPercentage,
    totalDeductions: 0,
    totalDeductionsPercentage: 0
  };
  
  // Total de deduções
  deductions.totalDeductions = deductions.taxes + deductions.commissionPlatform + 
    deductions.marketingValue + deductions.salesCommission + deductions.otherDeductions;
  deductions.totalDeductionsPercentage = (deductions.totalDeductions / desiredPrice) * 100;
  
  // Margem de contribuição = Preço - Custo - Deduções
  const contributionMargin = desiredPrice - productCost - deductions.totalDeductions;
  const contributionMarginPercentage = (contributionMargin / desiredPrice) * 100;
  
  return {
    method: 'desired_price',
    productCost,
    markup,
    calculatedPrice: desiredPrice,
    grossProfit,
    grossProfitPercentage,
    deductions,
    contributionMargin,
    contributionMarginPercentage,
    operationalExpenses: createEmptyOperationalExpenses()
  };
}

/**
 * Função principal para cálculo avançado de preços
 */
export function calculateAdvancedPrice(inputs: AdvancedPricingInputs): AdvancedCalculationResult {
  const { calculationMethod, deductionSettings, operationalExpenses } = inputs;
  
  let result: AdvancedCalculationResult;
  
  if (calculationMethod.type === 'markup' && calculationMethod.markup) {
    result = calculateByMarkup(
      calculationMethod.productCost,
      calculationMethod.markup,
      deductionSettings
    );
  } else if (calculationMethod.type === 'desired_price' && calculationMethod.desiredPrice) {
    result = calculateByDesiredPrice(
      calculationMethod.productCost,
      calculationMethod.desiredPrice,
      deductionSettings
    );
  } else {
    throw new Error('Método de cálculo inválido ou dados insuficientes');
  }
  
  // Adicionar despesas operacionais ao resultado
  result.operationalExpenses = operationalExpenses;
  
  return result;
}

/**
 * Cria estrutura vazia de despesas operacionais
 */
function createEmptyOperationalExpenses(): OperationalExpenses {
  return {
    operationalExpenses: {
      energiaEletrica: 0,
      materialEscritorio: 0,
      materialLimpezaHigiene: 0,
      seguranca: 0,
      servicosContabeis: 0,
      sistemasAdministrativos: 0,
      tarifasBancarias: 0,
      telefoneInternet: 0,
      transportesAdministrativos: 0,
      aguaEsgoto: 0,
      informatica: 0,
      outrosDespesasAdministrativas: 0,
      total: 0
    },
    personnelExpenses: {
      fgts: 0,
      gps: 0,
      proLabore: 0,
      salarios: 0,
      encargosTrabalhistasPatronais: 0,
      total: 0
    },
    investmentsAndLoans: {
      treinamentosInvestimentosEmprestimos: 0,
      total: 0
    },
    totalMonthlyObligations: 0
  };
}

/**
 * Calcula totais das despesas operacionais
 */
export function calculateOperationalExpensesTotals(expenses: OperationalExpenses): OperationalExpenses {
  const result = { ...expenses };
  
  // Total despesas operacionais
  result.operationalExpenses.total = 
    result.operationalExpenses.energiaEletrica +
    result.operationalExpenses.materialEscritorio +
    result.operationalExpenses.materialLimpezaHigiene +
    result.operationalExpenses.seguranca +
    result.operationalExpenses.servicosContabeis +
    result.operationalExpenses.sistemasAdministrativos +
    result.operationalExpenses.tarifasBancarias +
    result.operationalExpenses.telefoneInternet +
    result.operationalExpenses.transportesAdministrativos +
    result.operationalExpenses.aguaEsgoto +
    result.operationalExpenses.informatica +
    result.operationalExpenses.outrosDespesasAdministrativas;
  
  // Total despesas com pessoal
  result.personnelExpenses.total = 
    result.personnelExpenses.fgts +
    result.personnelExpenses.gps +
    result.personnelExpenses.proLabore +
    result.personnelExpenses.salarios +
    result.personnelExpenses.encargosTrabalhistasPatronais;
  
  // Total investimentos e empréstimos
  result.investmentsAndLoans.total = result.investmentsAndLoans.treinamentosInvestimentosEmprestimos;
  
  // Total geral de obrigações mensais
  result.totalMonthlyObligations = 
    result.operationalExpenses.total +
    result.personnelExpenses.total +
    result.investmentsAndLoans.total;
  
  return result;
}