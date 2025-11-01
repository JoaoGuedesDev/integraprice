'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RevenueData } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react';

interface RevenueSectionProps {
  revenueData?: RevenueData;
  onRevenueChange: (data: RevenueData) => void;
  referenceMonth?: string;
}

export function RevenueSection({ revenueData, onRevenueChange, referenceMonth }: RevenueSectionProps) {
  const [grossRevenue, setGrossRevenue] = useState(revenueData?.grossRevenue || 0);
  const [returns, setReturns] = useState(revenueData?.revenueDeductions.returns || 0);
  const [discounts, setDiscounts] = useState(revenueData?.revenueDeductions.discounts || 0);
  const [pisRate, setPisRate] = useState(1.65); // Taxa padrão PIS
  const [cofinsRate, setCofinsRate] = useState(7.6); // Taxa padrão COFINS
  const [otherTaxes, setOtherTaxes] = useState(revenueData?.revenueDeductions.taxes.other || 0);

  // Cálculos automáticos
  const pisAmount = (grossRevenue * pisRate) / 100;
  const cofinsAmount = (grossRevenue * cofinsRate) / 100;
  const totalTaxes = pisAmount + cofinsAmount + otherTaxes;
  const totalDeductions = returns + discounts + totalTaxes;
  const netRevenue = grossRevenue - totalDeductions;
  const revenueEfficiency = grossRevenue > 0 ? (netRevenue / grossRevenue) * 100 : 0;

  useEffect(() => {
    const updatedData: RevenueData = {
      grossRevenue,
      revenueDeductions: {
        returns,
        discounts,
        taxes: {
          pis: pisAmount,
          cofins: cofinsAmount,
          other: otherTaxes,
        },
      },
      netRevenue,
    };
    onRevenueChange(updatedData);
  }, [grossRevenue, returns, discounts, pisAmount, cofinsAmount, otherTaxes, netRevenue, onRevenueChange]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <CardTitle>Faturamento</CardTitle>
        </div>
        <CardDescription>
          Como preencher esta planilha? Preencha as colunas da planilha de acordo com as orientações a seguir:
          <br />
          <strong>1. Faturamento bruto (R$):</strong> infira o faturamento mensal do seu negócio;
          <br />
          <strong>2. Impostos (%):</strong> caso aplicável, infira a porcentagem de desconto dos impostos;
          <br />
          <strong>3. Faturamento líquido (R$):</strong> obtém o valor do faturamento líquido que será calculado automaticamente.
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

        {/* Faturamento Bruto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="grossRevenue">Faturamento Bruto (R$)</Label>
            <Input
              id="grossRevenue"
              type="number"
              value={grossRevenue}
              onChange={(e) => setGrossRevenue(Number(e.target.value))}
              placeholder="Ex: 100.000,00"
              className="text-right"
            />
          </div>
          <div className="space-y-2">
            <Label>Faturamento Mensal</Label>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-right font-medium">
              {formatCurrency(grossRevenue)}
            </div>
          </div>
        </div>

        {/* Impostos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Impostos (%)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pisRate">PIS (%)</Label>
              <Input
                id="pisRate"
                type="number"
                step="0.01"
                value={pisRate}
                onChange={(e) => setPisRate(Number(e.target.value))}
                className="text-right"
              />
              <div className="text-sm text-gray-600">
                Valor: {formatCurrency(pisAmount)}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cofinsRate">COFINS (%)</Label>
              <Input
                id="cofinsRate"
                type="number"
                step="0.01"
                value={cofinsRate}
                onChange={(e) => setCofinsRate(Number(e.target.value))}
                className="text-right"
              />
              <div className="text-sm text-gray-600">
                Valor: {formatCurrency(cofinsAmount)}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otherTaxes">Outros Impostos (R$)</Label>
              <Input
                id="otherTaxes"
                type="number"
                value={otherTaxes}
                onChange={(e) => setOtherTaxes(Number(e.target.value))}
                className="text-right"
              />
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total de Impostos:</span>
              <span className="font-bold text-blue-700">{formatCurrency(totalTaxes)}</span>
            </div>
          </div>
        </div>

        {/* Outras Deduções */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="returns">Devoluções (R$)</Label>
            <Input
              id="returns"
              type="number"
              value={returns}
              onChange={(e) => setReturns(Number(e.target.value))}
              placeholder="0,00"
              className="text-right"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="discounts">Descontos (R$)</Label>
            <Input
              id="discounts"
              type="number"
              value={discounts}
              onChange={(e) => setDiscounts(Number(e.target.value))}
              placeholder="0,00"
              className="text-right"
            />
          </div>
        </div>

        {/* Resumo do Faturamento */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-lg">Faturamento Líquido (R$)</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Faturamento bruto:</span>
              <span className="font-medium">{formatCurrency(grossRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total de impostos:</span>
              <span className="font-medium text-red-600">-{formatCurrency(totalTaxes)}</span>
            </div>
            <div className="flex justify-between">
              <span>Devoluções e descontos:</span>
              <span className="font-medium text-red-600">-{formatCurrency(returns + discounts)}</span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between text-lg font-bold">
              <span>Faturamento líquido:</span>
              <span className="text-green-600">{formatCurrency(netRevenue)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Badge variant={revenueEfficiency >= 80 ? "default" : revenueEfficiency >= 60 ? "secondary" : "destructive"}>
              Eficiência: {revenueEfficiency.toFixed(1)}%
            </Badge>
            <span className="text-sm text-gray-600">
              {revenueEfficiency >= 80 ? "Excelente" : revenueEfficiency >= 60 ? "Boa" : "Precisa melhorar"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}