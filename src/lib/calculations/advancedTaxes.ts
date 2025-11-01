import { Tax, TaxCalculationResult, PricingInputs } from '@/types';

/**
 * Calcula impostos de forma avançada considerando inclusão/exclusão e bases de cálculo
 */
export function calculateAdvancedTaxes(
  basePrice: number,
  taxes: Tax[],
  expectedVolume: number = 1
): {
  taxCalculations: TaxCalculationResult[];
  totalIncludedTaxes: number;
  totalExcludedTaxes: number;
  priceWithoutTaxes: number;
  priceWithIncludedTaxes: number;
  effectiveTaxRate: number;
} {
  const activeTaxes = taxes.filter(tax => tax.isActive);
  const taxCalculations: TaxCalculationResult[] = [];
  
  let totalIncludedTaxes = 0;
  let totalExcludedTaxes = 0;
  let workingPrice = basePrice;

  // Primeiro, calcular impostos incluídos (que fazem parte do preço)
  const includedTaxes = activeTaxes.filter(tax => tax.isIncluded);
  const excludedTaxes = activeTaxes.filter(tax => !tax.isIncluded);

  // Calcular impostos incluídos
  for (const tax of includedTaxes) {
    const calculationBase = getCalculationBase(workingPrice, tax.calculationBase, basePrice);
    const taxAmount = calculateTaxAmount(calculationBase, tax.percentage);
    
    taxCalculations.push({
      taxId: tax.id,
      name: tax.name,
      percentage: tax.percentage,
      calculationBase,
      taxAmount,
      isIncluded: tax.isIncluded,
      category: tax.category
    });

    totalIncludedTaxes += taxAmount;
  }

  // Preço sem impostos incluídos
  const priceWithoutIncludedTaxes = workingPrice - totalIncludedTaxes;

  // Calcular impostos excluídos (adicionais ao preço)
  for (const tax of excludedTaxes) {
    const calculationBase = getCalculationBase(priceWithoutIncludedTaxes, tax.calculationBase, basePrice);
    const taxAmount = calculateTaxAmount(calculationBase, tax.percentage);
    
    taxCalculations.push({
      taxId: tax.id,
      name: tax.name,
      percentage: tax.percentage,
      calculationBase,
      taxAmount,
      isIncluded: tax.isIncluded,
      category: tax.category
    });

    totalExcludedTaxes += taxAmount;
  }

  const priceWithoutTaxes = priceWithoutIncludedTaxes;
  const priceWithIncludedTaxes = workingPrice;
  const finalPriceWithAllTaxes = priceWithIncludedTaxes + totalExcludedTaxes;
  
  // Taxa efetiva de impostos
  const effectiveTaxRate = finalPriceWithAllTaxes > 0 
    ? ((totalIncludedTaxes + totalExcludedTaxes) / finalPriceWithAllTaxes) * 100 
    : 0;

  return {
    taxCalculations,
    totalIncludedTaxes,
    totalExcludedTaxes,
    priceWithoutTaxes,
    priceWithIncludedTaxes,
    effectiveTaxRate
  };
}

/**
 * Determina a base de cálculo para o imposto
 */
function getCalculationBase(currentPrice: number, calculationBase: Tax['calculationBase'], originalPrice: number): number {
  switch (calculationBase) {
    case 'gross':
      return currentPrice;
    case 'net':
      return originalPrice; // Usar preço original sem outros impostos
    case 'custom':
      return currentPrice; // Por enquanto, usar preço atual
    default:
      return currentPrice;
  }
}

/**
 * Calcula o valor do imposto baseado na alíquota
 */
function calculateTaxAmount(base: number, percentage: number): number {
  return (base * percentage) / 100;
}

/**
 * Calcula o preço líquido removendo impostos incluídos
 */
export function calculateNetPrice(grossPrice: number, includedTaxes: Tax[]): number {
  const activeTaxes = includedTaxes.filter(tax => tax.isActive && tax.isIncluded);
  const totalTaxRate = activeTaxes.reduce((total, tax) => total + tax.percentage, 0);
  
  // Fórmula: Preço Líquido = Preço Bruto / (1 + Taxa Total de Impostos/100)
  return grossPrice / (1 + totalTaxRate / 100);
}

/**
 * Calcula o preço bruto adicionando impostos ao preço líquido
 */
export function calculateGrossPrice(netPrice: number, taxes: Tax[]): number {
  const activeTaxes = taxes.filter(tax => tax.isActive);
  let grossPrice = netPrice;
  
  // Adicionar impostos incluídos
  const includedTaxes = activeTaxes.filter(tax => tax.isIncluded);
  const includedTaxRate = includedTaxes.reduce((total, tax) => total + tax.percentage, 0);
  grossPrice = netPrice * (1 + includedTaxRate / 100);
  
  // Adicionar impostos excluídos
  const excludedTaxes = activeTaxes.filter(tax => !tax.isIncluded);
  for (const tax of excludedTaxes) {
    grossPrice += (grossPrice * tax.percentage) / 100;
  }
  
  return grossPrice;
}

/**
 * Valida se a configuração de impostos está correta
 */
export function validateTaxConfiguration(taxes: Tax[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Verificar se há impostos duplicados
  const taxCategories = taxes.filter(tax => tax.isActive).map(tax => tax.category);
  const duplicates = taxCategories.filter((category, index) => taxCategories.indexOf(category) !== index);
  
  if (duplicates.length > 0) {
    warnings.push(`Impostos duplicados encontrados: ${duplicates.join(', ')}`);
  }
  
  // Verificar alíquotas muito altas
  const highTaxes = taxes.filter(tax => tax.isActive && tax.percentage > 50);
  if (highTaxes.length > 0) {
    warnings.push(`Alíquotas muito altas detectadas: ${highTaxes.map(t => t.name).join(', ')}`);
  }
  
  // Verificar se há pelo menos um imposto ativo
  const activeTaxes = taxes.filter(tax => tax.isActive);
  if (activeTaxes.length === 0) {
    warnings.push('Nenhum imposto ativo encontrado');
  }
  
  // Verificar alíquotas negativas
  const negativeTaxes = taxes.filter(tax => tax.percentage < 0);
  if (negativeTaxes.length > 0) {
    errors.push(`Alíquotas negativas não são permitidas: ${negativeTaxes.map(t => t.name).join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Calcula o impacto de mudanças tributárias
 */
export function calculateTaxImpact(
  basePrice: number,
  currentTaxes: Tax[],
  newTaxes: Tax[]
): {
  currentTotal: number;
  newTotal: number;
  difference: number;
  percentageChange: number;
} {
  const currentResult = calculateAdvancedTaxes(basePrice, currentTaxes);
  const newResult = calculateAdvancedTaxes(basePrice, newTaxes);
  
  const currentTotal = currentResult.totalIncludedTaxes + currentResult.totalExcludedTaxes;
  const newTotal = newResult.totalIncludedTaxes + newResult.totalExcludedTaxes;
  const difference = newTotal - currentTotal;
  const percentageChange = currentTotal > 0 ? (difference / currentTotal) * 100 : 0;
  
  return {
    currentTotal,
    newTotal,
    difference,
    percentageChange
  };
}

/**
 * Otimiza a configuração de impostos para minimizar carga tributária
 */
export function optimizeTaxConfiguration(
  basePrice: number,
  availableTaxes: Tax[],
  constraints: {
    requiredTaxes: string[]; // IDs de impostos obrigatórios
    maxTotalRate: number; // Taxa máxima total permitida
  }
): {
  optimizedTaxes: Tax[];
  totalRate: number;
  savings: number;
} {
  // Implementação básica - pode ser expandida com algoritmos mais sofisticados
  const requiredTaxes = availableTaxes.filter(tax => 
    constraints.requiredTaxes.includes(tax.id)
  );
  
  const optionalTaxes = availableTaxes.filter(tax => 
    !constraints.requiredTaxes.includes(tax.id)
  );
  
  let optimizedTaxes = [...requiredTaxes.map(tax => ({ ...tax, isActive: true }))];
  let currentRate = requiredTaxes.reduce((total, tax) => total + tax.percentage, 0);
  
  // Adicionar impostos opcionais se não exceder o limite
  for (const tax of optionalTaxes) {
    if (currentRate + tax.percentage <= constraints.maxTotalRate) {
      optimizedTaxes.push({ ...tax, isActive: true });
      currentRate += tax.percentage;
    } else {
      optimizedTaxes.push({ ...tax, isActive: false });
    }
  }
  
  const originalResult = calculateAdvancedTaxes(basePrice, availableTaxes);
  const optimizedResult = calculateAdvancedTaxes(basePrice, optimizedTaxes);
  
  const originalTotal = originalResult.totalIncludedTaxes + originalResult.totalExcludedTaxes;
  const optimizedTotal = optimizedResult.totalIncludedTaxes + optimizedResult.totalExcludedTaxes;
  
  return {
    optimizedTaxes,
    totalRate: currentRate,
    savings: originalTotal - optimizedTotal
  };
}