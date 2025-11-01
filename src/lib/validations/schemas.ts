import { z } from 'zod';

// Schema para custos fixos
export const fixedCostSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  value: z.number().min(0, 'Valor deve ser positivo'),
  category: z.enum(['rent', 'salaries', 'utilities', 'insurance', 'other']),
});

// Schema para custos variáveis
export const variableCostSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  valuePerUnit: z.number().min(0, 'Valor por unidade deve ser positivo'),
  category: z.enum(['materials', 'labor', 'packaging', 'shipping', 'other']),
});

// Schema para impostos
export const taxSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  percentage: z.number().min(0, 'Percentual deve ser positivo').max(100, 'Percentual não pode exceder 100%'),
  type: z.enum(['federal', 'state', 'municipal', 'other']),
});

// Schema principal para dados de entrada
export const pricingInputsSchema = z.object({
  fixedCosts: z.array(fixedCostSchema).min(1, 'Pelo menos um custo fixo é obrigatório'),
  variableCosts: z.array(variableCostSchema).min(1, 'Pelo menos um custo variável é obrigatório'),
  taxes: z.array(taxSchema),
  desiredMargin: z.number().min(0, 'Margem deve ser positiva').max(1000, 'Margem muito alta'),
  expectedVolume: z.number().min(1, 'Volume esperado deve ser maior que zero'),
  productName: z.string().min(1, 'Nome do produto é obrigatório').max(200, 'Nome muito longo'),
});

// Tipos inferidos dos schemas
export type FixedCostInput = z.infer<typeof fixedCostSchema>;
export type VariableCostInput = z.infer<typeof variableCostSchema>;
export type TaxInput = z.infer<typeof taxSchema>;
export type PricingInputsForm = z.infer<typeof pricingInputsSchema>;
