'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, DollarSign, Calculator, BarChart3, Target, Percent } from 'lucide-react';
import { AdvancedCalculationResult } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface AdvancedResultsDisplayProps {
  result: AdvancedCalculationResult;
}

export function AdvancedResultsDisplay({ result }: AdvancedResultsDisplayProps) {
  const isMarkupMethod = result.method === 'markup';
  
  return (
    <div className="space-y-6">
      {/* Resumo Principal */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isMarkupMethod ? (
              <>
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Preço Calculado por Markup
              </>
            ) : (
              <>
                <Target className="h-5 w-5 text-green-600" />
                Cálculo por Preço Desejado
              </>
            )}
          </CardTitle>
          <CardDescription>
            Resultado usando metodologia avançada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna Esquerda - Dados Principais */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">
                  {isMarkupMethod ? 'Preço Calculado por Markup' : 'Cálculo por Preço Desejado'}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Custo do Produto:</span>
                    <span className="font-medium">{formatCurrency(result.productCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Markup {isMarkupMethod ? 'Desejado' : 'Calculado'}:</span>
                    <span className="font-medium">{result.markup.toFixed(1)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-blue-700">
                    <span>Preço {isMarkupMethod ? 'CALCULADO' : 'DESEJADO'}:</span>
                    <span>{formatCurrency(result.calculatedPrice)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Lucro Bruto:</span>
                    <span className="font-medium">
                      {formatCurrency(result.grossProfit)} ({formatPercentage(result.grossProfitPercentage)})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Deduções */}
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-3">Deduções</h3>
                <div className="space-y-2 text-sm">
                  {result.deductions.taxesPercentage > 0 && (
                    <div className="flex justify-between">
                      <span>Impostos ({formatPercentage(result.deductions.taxesPercentage)}):</span>
                      <span>{formatCurrency(result.deductions.taxes)}</span>
                    </div>
                  )}
                  {result.deductions.commissionPlatformPercentage > 0 && (
                    <div className="flex justify-between">
                      <span>Comissão Plataforma ({formatPercentage(result.deductions.commissionPlatformPercentage)}):</span>
                      <span>{formatCurrency(result.deductions.commissionPlatform)}</span>
                    </div>
                  )}
                  {result.deductions.marketingPercentage > 0 && (
                    <div className="flex justify-between">
                      <span>Marketing ({formatPercentage(result.deductions.marketingPercentage)}):</span>
                      <span>{formatCurrency(result.deductions.marketingValue)}</span>
                    </div>
                  )}
                  {result.deductions.salesCommissionPercentage > 0 && (
                    <div className="flex justify-between">
                      <span>Comissão Vendedor ({formatPercentage(result.deductions.salesCommissionPercentage)}):</span>
                      <span>{formatCurrency(result.deductions.salesCommission)}</span>
                    </div>
                  )}
                  {result.deductions.otherDeductionsPercentage > 0 && (
                    <div className="flex justify-between">
                      <span>Outras Deduções ({formatPercentage(result.deductions.otherDeductionsPercentage)}):</span>
                      <span>{formatCurrency(result.deductions.otherDeductions)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-orange-700">
                    <span>Total de Deduções:</span>
                    <span>{formatCurrency(result.deductions.totalDeductions)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-orange-600">
                    <span>% do Preço:</span>
                    <span>{formatPercentage(result.deductions.totalDeductionsPercentage)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Margem de Contribuição */}
          <div className="mt-6 bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Margem de Contribuição</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span>Margem de Contribuição:</span>
                <span className="font-bold text-green-700">{formatCurrency(result.contributionMargin)}</span>
              </div>
              <div className="flex justify-between">
                <span>% da Margem:</span>
                <span className="font-bold text-green-700">{formatPercentage(result.contributionMarginPercentage)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Despesas Operacionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Obrigações Mensais Fixas ou Eventuais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Despesas Operacionais */}
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">Despesas Operacionais</h4>
              <div className="space-y-2 text-sm">
                {result.operationalExpenses.operationalExpenses.energiaEletrica > 0 && (
                  <div className="flex justify-between">
                    <span>Energia Elétrica:</span>
                    <span>{formatCurrency(result.operationalExpenses.operationalExpenses.energiaEletrica)}</span>
                  </div>
                )}
                {result.operationalExpenses.operationalExpenses.materialEscritorio > 0 && (
                  <div className="flex justify-between">
                    <span>Material de Escritório:</span>
                    <span>{formatCurrency(result.operationalExpenses.operationalExpenses.materialEscritorio)}</span>
                  </div>
                )}
                {result.operationalExpenses.operationalExpenses.seguranca > 0 && (
                  <div className="flex justify-between">
                    <span>Segurança:</span>
                    <span>{formatCurrency(result.operationalExpenses.operationalExpenses.seguranca)}</span>
                  </div>
                )}
                {result.operationalExpenses.operationalExpenses.servicosContabeis > 0 && (
                  <div className="flex justify-between">
                    <span>Serviços Contábeis:</span>
                    <span>{formatCurrency(result.operationalExpenses.operationalExpenses.servicosContabeis)}</span>
                  </div>
                )}
                {result.operationalExpenses.operationalExpenses.telefoneInternet > 0 && (
                  <div className="flex justify-between">
                    <span>Telefone e Internet:</span>
                    <span>{formatCurrency(result.operationalExpenses.operationalExpenses.telefoneInternet)}</span>
                  </div>
                )}
                {result.operationalExpenses.operationalExpenses.informatica > 0 && (
                  <div className="flex justify-between">
                    <span>Informática:</span>
                    <span>{formatCurrency(result.operationalExpenses.operationalExpenses.informatica)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-blue-700">
                  <span>Total Despesas Operacionais:</span>
                  <span>{formatCurrency(result.operationalExpenses.operationalExpenses.total)}</span>
                </div>
              </div>
            </div>

            {/* Despesas com Pessoal */}
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-600">Despesas com Pessoal</h4>
              <div className="space-y-2 text-sm">
                {result.operationalExpenses.personnelExpenses.fgts > 0 && (
                  <div className="flex justify-between">
                    <span>FGTS:</span>
                    <span>{formatCurrency(result.operationalExpenses.personnelExpenses.fgts)}</span>
                  </div>
                )}
                {result.operationalExpenses.personnelExpenses.gps > 0 && (
                  <div className="flex justify-between">
                    <span>GPS:</span>
                    <span>{formatCurrency(result.operationalExpenses.personnelExpenses.gps)}</span>
                  </div>
                )}
                {result.operationalExpenses.personnelExpenses.proLabore > 0 && (
                  <div className="flex justify-between">
                    <span>Pró-Labore:</span>
                    <span>{formatCurrency(result.operationalExpenses.personnelExpenses.proLabore)}</span>
                  </div>
                )}
                {result.operationalExpenses.personnelExpenses.salarios > 0 && (
                  <div className="flex justify-between">
                    <span>Salários:</span>
                    <span>{formatCurrency(result.operationalExpenses.personnelExpenses.salarios)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-purple-700">
                  <span>Total Despesas com Pessoal:</span>
                  <span>{formatCurrency(result.operationalExpenses.personnelExpenses.total)}</span>
                </div>
              </div>
            </div>

            {/* Resumo Total */}
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Resumo Total</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Despesas Operacionais:</span>
                  <span>{formatCurrency(result.operationalExpenses.operationalExpenses.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Despesas com Pessoal:</span>
                  <span>{formatCurrency(result.operationalExpenses.personnelExpenses.total)}</span>
                </div>
                {result.operationalExpenses.investmentsAndLoans.total > 0 && (
                  <div className="flex justify-between">
                    <span>Treinamentos/Investimentos:</span>
                    <span>{formatCurrency(result.operationalExpenses.investmentsAndLoans.total)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-green-700 text-base">
                  <span>Total de Obrigações Mensais:</span>
                  <span>{formatCurrency(result.operationalExpenses.totalMonthlyObligations)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicadores de Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Indicadores de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{formatPercentage(result.grossProfitPercentage)}</div>
              <div className="text-sm text-blue-700">Lucro Bruto</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatPercentage(result.contributionMarginPercentage)}</div>
              <div className="text-sm text-green-700">Margem de Contribuição</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{formatPercentage(result.deductions.totalDeductionsPercentage)}</div>
              <div className="text-sm text-orange-700">Total de Deduções</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{result.markup.toFixed(1)}x</div>
              <div className="text-sm text-purple-700">Markup</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}