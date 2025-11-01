'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpenseCategory, ExpenseItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Plus, Trash2, Calculator, AlertCircle, Building, TrendingDown } from 'lucide-react';

interface ExpenseCategoriesProps {
  expenseCategories?: ExpenseCategory[];
  onExpensesChange: (categories: ExpenseCategory[]) => void;
  referenceMonth?: string;
  grossRevenue?: number;
}

export function ExpenseCategories({ 
  expenseCategories = [], 
  onExpensesChange, 
  referenceMonth,
  grossRevenue = 0 
}: ExpenseCategoriesProps) {
  const [categories, setCategories] = useState<ExpenseCategory[]>(() => {
    if (expenseCategories.length > 0) return expenseCategories;
    
    // Categorias padrão baseadas na planilha SEBRAE
    return [
      {
        id: 'fixed',
        name: 'Despesas Fixas',
        type: 'fixed',
        total: 0,
        items: [
          { id: 'rent', description: 'Aluguel', value: 0, category: 'fixed' },
          { id: 'internet', description: 'Internet', value: 0, category: 'fixed' },
          { id: 'phone', description: 'Conta de celular', value: 0, category: 'fixed' },
          { id: 'water', description: 'Água', value: 0, category: 'fixed' },
          { id: 'electricity', description: 'Luz', value: 0, category: 'fixed' },
          { id: 'software', description: 'Plataforma/softwares', value: 0, category: 'fixed' },
        ]
      },
      {
        id: 'variable',
        name: 'Despesas Variáveis',
        type: 'variable',
        total: 0,
        items: [
          { id: 'raw-materials', description: 'Matérias-primas', value: 0, category: 'variable' },
          { id: 'packaging', description: 'Embalagens', value: 0, category: 'variable' },
          { id: 'labels', description: 'Etiquetas', value: 0, category: 'variable' },
          { id: 'territory-material', description: 'Material de território', value: 0, category: 'variable' },
          { id: 'example-expense1', description: 'Exemplo de despesa', value: 0, category: 'variable' },
          { id: 'example-expense2', description: 'Exemplo de despesa', value: 0, category: 'variable' },
        ]
      }
    ];
  });

  // Calcular totais
  const calculateTotals = (cats: ExpenseCategory[]) => {
    return cats.map(category => ({
      ...category,
      total: category.items.reduce((sum, item) => {
        if (item.isPercentage && grossRevenue > 0) {
          return sum + (grossRevenue * item.value / 100);
        }
        return sum + item.value;
      }, 0)
    }));
  };

  useEffect(() => {
    const updatedCategories = calculateTotals(categories);
    setCategories(updatedCategories);
    onExpensesChange(updatedCategories);
  }, [grossRevenue]);

  const updateItemValue = (categoryId: string, itemId: string, value: number) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => 
            item.id === itemId ? { ...item, value } : item
          )
        };
      }
      return category;
    });
    
    const categoriesWithTotals = calculateTotals(updatedCategories);
    setCategories(categoriesWithTotals);
    onExpensesChange(categoriesWithTotals);
  };

  const addExpenseItem = (categoryId: string) => {
    const newItem: ExpenseItem = {
      id: `item-${Date.now()}`,
      description: 'Nova despesa',
      value: 0,
      category: categoryId === 'fixed' ? 'fixed' : 'variable'
    };

    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: [...category.items, newItem]
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    onExpensesChange(updatedCategories);
  };

  const removeExpenseItem = (categoryId: string, itemId: string) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter(item => item.id !== itemId)
        };
      }
      return category;
    });

    const categoriesWithTotals = calculateTotals(updatedCategories);
    setCategories(categoriesWithTotals);
    onExpensesChange(categoriesWithTotals);
  };

  const updateItemDescription = (categoryId: string, itemId: string, description: string) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => 
            item.id === itemId ? { ...item, description } : item
          )
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    onExpensesChange(updatedCategories);
  };

  const totalFixedExpenses = categories.find(c => c.type === 'fixed')?.total || 0;
  const totalVariableExpenses = categories.find(c => c.type === 'variable')?.total || 0;
  const totalExpenses = totalFixedExpenses + totalVariableExpenses;
  const expenseRatio = grossRevenue > 0 ? (totalExpenses / grossRevenue) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-600" />
          <CardTitle>Despesas</CardTitle>
        </div>
        <CardDescription>
          Preencha as colunas da planilha de acordo com as orientações a seguir:
          <br />
          <strong>1. Despesas fixas:</strong> infira a descrição e valores de despesas fixas do seu negócio;
          <br />
          <strong>2. Despesas variáveis:</strong> infira a descrição e valores de despesas variáveis do seu negócio;
          <br />
          <strong>3. Total das despesas:</strong> obtém o valor total das despesas que será calculado automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alerta informativo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Atenção:</strong> Não edite as células desta cor. Os campos em azul serão calculados de forma automática.
              <br />
              <strong>Mês de referência:</strong> {referenceMonth || 'não definido'}
            </div>
          </div>
        </div>

        <Tabs defaultValue="fixed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fixed" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Despesas Fixas
            </TabsTrigger>
            <TabsTrigger value="variable" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Despesas Variáveis
            </TabsTrigger>
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.type} className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <Button
                    onClick={() => addExpenseItem(category.id)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Item
                  </Button>
                </div>

                <div className="space-y-2">
                  {category.items.map(item => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border border-gray-200 rounded-lg">
                      <div className="space-y-1">
                        <Label htmlFor={`desc-${item.id}`}>Descrição</Label>
                        <Input
                          id={`desc-${item.id}`}
                          value={item.description}
                          onChange={(e) => updateItemDescription(category.id, item.id, e.target.value)}
                          placeholder="Descrição da despesa"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor={`value-${item.id}`}>Valor (R$)</Label>
                        <Input
                          id={`value-${item.id}`}
                          type="number"
                          value={item.value}
                          onChange={(e) => updateItemValue(category.id, item.id, Number(e.target.value))}
                          placeholder="0,00"
                          className="text-right"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <Button
                          onClick={() => removeExpenseItem(category.id, item.id)}
                          size="sm"
                          variant="outline"
                          className="w-full flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total {category.name}:</span>
                    <span className="font-bold text-blue-700">{formatCurrency(category.total)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Resumo Total das Despesas */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-lg">Total das Despesas</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Despesas fixas:</span>
              <span className="font-medium">{formatCurrency(totalFixedExpenses)}</span>
            </div>
            <div className="flex justify-between">
              <span>Despesas variáveis:</span>
              <span className="font-medium">{formatCurrency(totalVariableExpenses)}</span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total (R$):</span>
              <span className="text-red-600">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>% Total das despesas sob o faturamento:</span>
              <span className="font-medium">{expenseRatio.toFixed(2)}%</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Badge variant={expenseRatio <= 60 ? "default" : expenseRatio <= 80 ? "secondary" : "destructive"}>
              Eficiência: {expenseRatio <= 60 ? "Excelente" : expenseRatio <= 80 ? "Boa" : "Alta"}
            </Badge>
            <span className="text-sm text-gray-600">
              {expenseRatio <= 60 ? "Despesas controladas" : expenseRatio <= 80 ? "Despesas moderadas" : "Revisar despesas"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}