'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PricingResults } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { TrendingUp, DollarSign, Percent, Info } from 'lucide-react';

interface PriceCompositionChartProps {
  results: PricingResults;
  className?: string;
}

export function PriceCompositionChart({ results, className = '' }: PriceCompositionChartProps) {
  const { currentTheme } = useTheme();
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [animationKey, setAnimationKey] = useState(0);

  // Dados para o gráfico de pizza
  const pieData = [
    {
      name: 'Custo Unitário',
      value: results.unitCost,
      color: currentTheme.colors.primary,
      percentage: (results.unitCost / results.finalPrice) * 100
    },
    {
      name: 'Impostos Inclusos',
      value: results.totalIncludedTaxes || 0,
      color: currentTheme.colors.warning,
      percentage: ((results.totalIncludedTaxes || 0) / results.finalPrice) * 100
    },
    {
      name: 'Impostos Exclusos',
      value: results.totalExcludedTaxes || 0,
      color: currentTheme.colors.error,
      percentage: ((results.totalExcludedTaxes || 0) / results.finalPrice) * 100
    },
    {
      name: 'Margem de Lucro',
      value: results.finalPrice - results.unitCost - (results.totalIncludedTaxes || 0) - (results.totalExcludedTaxes || 0),
      color: currentTheme.colors.success,
      percentage: ((results.finalPrice - results.unitCost - (results.totalIncludedTaxes || 0) - (results.totalExcludedTaxes || 0)) / results.finalPrice) * 100
    }
  ].filter(item => item.value > 0);

  // Dados para o gráfico de barras
  const barData = [
    {
      name: 'Custo',
      valor: results.unitCost,
      tipo: 'Custo Base'
    },
    {
      name: 'Impostos Inc.',
      valor: results.totalIncludedTaxes || 0,
      tipo: 'Impostos Inclusos'
    },
    {
      name: 'Impostos Exc.',
      valor: results.totalExcludedTaxes || 0,
      tipo: 'Impostos Exclusos'
    },
    {
      name: 'Margem',
      valor: results.finalPrice - results.unitCost - (results.totalIncludedTaxes || 0) - (results.totalExcludedTaxes || 0),
      tipo: 'Margem de Lucro'
    }
  ].filter(item => item.valor > 0);

  // Reanimação quando os dados mudam
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [results]);

  // Tooltip customizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{data.name || label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Valor: <span className="font-medium text-green-600 dark:text-green-400">
              R$ {(data.value || data.valor).toFixed(2)}
            </span>
          </p>
          {data.percentage && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Percentual: <span className="font-medium">{data.percentage.toFixed(1)}%</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Legenda customizada
  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{entry.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Composição do Preço
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Análise detalhada dos componentes
            </p>
          </div>
        </div>

        {/* Seletor de tipo de gráfico */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
              chartType === 'pie'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Pizza
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
              chartType === 'bar'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Barras
          </button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Preço Final
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            R$ {results.finalPrice.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Percent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Margem Real
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {results.realMargin.toFixed(1)}%
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Taxa Efetiva
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {(results.effectiveTaxRate || 0).toFixed(1)}%
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Lucro Líquido
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {results.netMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart key={animationKey}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          ) : (
            <BarChart key={animationKey} data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.mode === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="name" 
                stroke={currentTheme.mode === 'dark' ? '#9ca3af' : '#6b7280'}
                fontSize={12}
              />
              <YAxis 
                stroke={currentTheme.mode === 'dark' ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="valor" 
                fill={currentTheme.colors.primary}
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Detalhamento dos impostos */}
      {results.taxCalculations && results.taxCalculations.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Detalhamento dos Impostos
          </h4>
          <div className="space-y-2">
            {results.taxCalculations.map((tax, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentTheme.colors.warning }}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {tax.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({tax.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    R$ {tax.taxAmount.toFixed(2)}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {tax.isIncluded ? 'Incluso' : 'Excluso'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}