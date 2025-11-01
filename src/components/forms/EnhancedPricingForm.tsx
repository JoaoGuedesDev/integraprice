'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RevenueSection } from './RevenueSection';
import { ExpenseCategories } from './ExpenseCategories';
import { PricingInputs, RevenueData, ExpenseCategory, FixedCost, VariableCost } from '@/types';
import { Calculator, Package, TrendingUp, Settings, Sparkles } from 'lucide-react';

interface EnhancedPricingFormProps {
  onCalculate: (data: PricingInputs) => void;
  isLoading?: boolean;
}

export function EnhancedPricingForm({ onCalculate, isLoading = false }: EnhancedPricingFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  
  // Dados básicos
  const [productName, setProductName] = useState('');
  const [expectedVolume, setExpectedVolume] = useState(1000);
  const [desiredMargin, setDesiredMargin] = useState(30);
  const [businessType, setBusinessType] = useState<'product' | 'service' | 'mixed'>('product');
  const [referenceMonth, setReferenceMonth] = useState(new Date().toISOString().slice(0, 7));
  
  // Dados de faturamento
  const [revenueData, setRevenueData] = useState<RevenueData>({
    grossRevenue: 0,
    revenueDeductions: {
      returns: 0,
      discounts: 0,
      taxes: { pis: 0, cofins: 0, other: 0 }
    },
    netRevenue: 0
  });
  
  // Categorias de despesas
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  
  // Custos tradicionais (para compatibilidade)
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
  const [variableCosts, setVariableCosts] = useState<VariableCost[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Converter categorias de despesas para custos fixos e variáveis
    const convertedFixedCosts: FixedCost[] = [];
    const convertedVariableCosts: VariableCost[] = [];
    
    expenseCategories.forEach(category => {
      category.items.forEach(item => {
        if (category.type === 'fixed') {
          convertedFixedCosts.push({
            id: item.id,
            name: item.description,
            value: item.value,
            category: 'other'
          });
        } else {
          convertedVariableCosts.push({
            id: item.id,
            name: item.description,
            valuePerUnit: item.value / expectedVolume, // Converter para valor por unidade
            category: 'other'
          });
        }
      });
    });

    const pricingInputs: PricingInputs = {
      productName,
      expectedVolume,
      desiredMargin,
      businessType,
      referenceMonth,
      revenueData,
      expenseCategories,
      fixedCosts: [...fixedCosts, ...convertedFixedCosts],
      variableCosts: [...variableCosts, ...convertedVariableCosts],
      taxes: [] // Será implementado posteriormente
    };

    onCalculate(pricingInputs);
  };

  const isFormValid = productName.trim() !== '' && expectedVolume > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle>Precificação Inteligente - Metodologia Avançada</CardTitle>
          </div>
          <CardDescription>
            Sistema completo de precificação baseado nas melhores práticas para pequenas e médias empresas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Básico
              </TabsTrigger>
              <TabsTrigger value="revenue" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Faturamento
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Despesas
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Nome do Produto/Serviço *</Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex: Produto A, Serviço de Consultoria"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessType">Tipo de Negócio</Label>
                  <select
                    id="businessType"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as 'product' | 'service' | 'mixed')}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="product">Produto</option>
                    <option value="service">Serviço</option>
                    <option value="mixed">Misto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedVolume">Volume Esperado (unidades/mês) *</Label>
                  <Input
                    id="expectedVolume"
                    type="number"
                    value={expectedVolume}
                    onChange={(e) => setExpectedVolume(Number(e.target.value))}
                    placeholder="1000"
                    min="1"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="desiredMargin">Margem Desejada (%) *</Label>
                  <Input
                    id="desiredMargin"
                    type="number"
                    value={desiredMargin}
                    onChange={(e) => setDesiredMargin(Number(e.target.value))}
                    placeholder="30"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceMonth">Mês de Referência</Label>
                <Input
                  id="referenceMonth"
                  type="month"
                  value={referenceMonth}
                  onChange={(e) => setReferenceMonth(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="mt-6">
              <RevenueSection
                revenueData={revenueData}
                onRevenueChange={setRevenueData}
                referenceMonth={referenceMonth}
              />
            </TabsContent>

            <TabsContent value="expenses" className="mt-6">
              <ExpenseCategories
                expenseCategories={expenseCategories}
                onExpensesChange={setExpenseCategories}
                referenceMonth={referenceMonth}
                grossRevenue={revenueData.grossRevenue}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configurações Avançadas</CardTitle>
                  <CardDescription>
                    Configurações adicionais para cálculos mais precisos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Método de Cálculo</Label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="advanced">Metodologia Avançada</option>
                        <option value="traditional">Método Tradicional</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Regime Tributário</Label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="simples">Simples Nacional</option>
                        <option value="presumido">Lucro Presumido</option>
                        <option value="real">Lucro Real</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Resumo dos Dados</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Faturamento Bruto:</span>
                        <div className="font-medium">R$ {revenueData.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      </div>
                      <div>
                        <span className="text-blue-700">Total de Despesas:</span>
                        <div className="font-medium">
                          R$ {expenseCategories.reduce((sum, cat) => sum + cat.total, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Badge variant={isFormValid ? "default" : "secondary"}>
                {isFormValid ? "Pronto para calcular" : "Preencha os campos obrigatórios"}
              </Badge>
            </div>
            
            <Button 
              type="submit" 
              disabled={!isFormValid || isLoading}
              className="flex items-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              {isLoading ? 'Calculando...' : 'Calcular Precificação'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}