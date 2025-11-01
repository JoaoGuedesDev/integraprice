'use client';

import React from 'react';
import { PricingInputs, PricingResults } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Percent, Target } from 'lucide-react';

interface ResultsDisplayProps {
  inputs: PricingInputs;
  results: PricingResults;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const formatCurrency = (value: number) => {
  return R$ ;
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};

export default function ResultsDisplay({ inputs, results }: ResultsDisplayProps) {
  const costBreakdown = [
    { name: 'Custos Fixos', value: results.totalFixedCosts, color: '#0088FE' },
    { name: 'Custos Variáveis', value: results.totalVariableCosts, color: '#00C49F' },
    { name: 'Impostos', value: results.totalTaxes, color: '#FFBB28' },
    { name: 'Margem de Lucro', value: results.profit, color: '#FF8042' }
  ];

  const marginAnalysis = [
    { category: 'Margem Desejada', percentage: inputs.desiredMargin },
    { category: 'Margem Real', percentage: results.realMargin },
    { category: 'Margem Líquida', percentage: results.netMargin }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preço Final</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(results.finalPrice)}</div>
            <p className="text-xs text-muted-foreground">
              Por unidade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Real</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(results.realMargin)}</div>
            <p className="text-xs text-muted-foreground">
              Margem obtida
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(results.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Volume: {inputs.expectedVolume} unidades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(results.totalProfit)}</div>
            <p className="text-xs text-muted-foreground">
              Lucro líquido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Composição de Custos */}
        <Card>
          <CardHeader>
            <CardTitle>Composição de Custos</CardTitle>
            <CardDescription>Distribuição dos custos por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Barras - Análise de Margem */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Margem</CardTitle>
            <CardDescription>Comparação entre margens desejada e real</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marginAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
                <Legend />
                <Bar dataKey="percentage" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento de Custos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custos Fixos */}
        <Card>
          <CardHeader>
            <CardTitle>Custos Fixos</CardTitle>
            <CardDescription>Total: {formatCurrency(results.totalFixedCosts)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inputs.fixedCosts.map((cost, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm">{cost.name}</span>
                  <span className="text-sm font-medium">{formatCurrency(cost.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custos Variáveis */}
        <Card>
          <CardHeader>
            <CardTitle>Custos Variáveis</CardTitle>
            <CardDescription>Total: {formatCurrency(results.totalVariableCosts)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inputs.variableCosts.map((cost, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm">{cost.name}</span>
                  <span className="text-sm font-medium">{formatCurrency(cost.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impostos */}
        <Card>
          <CardHeader>
            <CardTitle>Impostos</CardTitle>
            <CardDescription>Total: {formatCurrency(results.totalTaxes)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inputs.taxes.map((tax, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm">{tax.name}</span>
                  <span className="text-sm font-medium">{formatPercentage(tax.rate)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




