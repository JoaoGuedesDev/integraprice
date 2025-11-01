import { BasicFormData, BasicCalculationResult } from '@/types';

/**
 * Calcula o preço de venda usando metodologia básica
 * @param data Dados do formulário básico
 * @returns Resultados da precificação
 */
export function calculateBasicPrice(data: BasicFormData): BasicCalculationResult {
  const { productCost, desiredMargin } = data;
  
  // Calcula o preço de venda baseado na margem desejada
  const sellingPrice = productCost * (1 + desiredMargin / 100);
  
  // Calcula o lucro por unidade
  const profit = sellingPrice - productCost;
  
  // A margem percentual é a mesma que foi inserida
  const marginPercentage = desiredMargin;
  
  return {
    sellingPrice,
    profit,
    marginPercentage,
    productCost
  };
}

/**
 * Valida os dados do formulário básico
 * @param data Dados do formulário
 * @returns true se os dados são válidos
 */
export function validateBasicFormData(data: BasicFormData): boolean {
  return (
    data.productCost > 0 &&
    data.desiredMargin >= 0 &&
    data.desiredMargin <= 1000 // Limite máximo de 1000% de margem
  );
}

/**
 * Calcula diferentes cenários de preço baseados em margens variadas
 * @param productCost Custo do produto
 * @returns Array com diferentes cenários
 */
export function calculatePriceScenarios(productCost: number) {
  const margins = [10, 20, 30, 40, 50];
  
  return margins.map(margin => ({
    margin,
    sellingPrice: productCost * (1 + margin / 100),
    profit: productCost * (margin / 100)
  }));
}