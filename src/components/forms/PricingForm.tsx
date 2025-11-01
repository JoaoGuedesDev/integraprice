'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';

interface PricingFormProps {
  onSubmit: (data: any) => void;
}

const PricingForm: React.FC<PricingFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    productName: '',
    variableCost: 0,
    fixedCost: 0,
    targetMargin: 30,
    expectedVolume: 100
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const calculatePrice = () => {
    const { variableCost, fixedCost, targetMargin, expectedVolume } = formData;
    const fixedCostPerUnit = fixedCost / expectedVolume;
    const totalCostPerUnit = variableCost + fixedCostPerUnit;
    return totalCostPerUnit / (1 - targetMargin / 100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Calculadora de Preços</span>
          </CardTitle>
          <CardDescription>
            Defina os custos e margem para calcular o preço ideal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Nome do Produto</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => setFormData({...formData, productName: e.target.value})}
              placeholder="Ex: Smartphone XYZ"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="variableCost">Custo Variável (R$)</Label>
              <Input
                id="variableCost"
                type="number"
                step="0.01"
                value={formData.variableCost}
                onChange={(e) => setFormData({...formData, variableCost: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fixedCost">Custo Fixo Mensal (R$)</Label>
              <Input
                id="fixedCost"
                type="number"
                step="0.01"
                value={formData.fixedCost}
                onChange={(e) => setFormData({...formData, fixedCost: parseFloat(e.target.value) || 0})}
                placeholder="5000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetMargin">Margem de Lucro (%)</Label>
              <Input
                id="targetMargin"
                type="number"
                min="0"
                max="100"
                value={formData.targetMargin}
                onChange={(e) => setFormData({...formData, targetMargin: parseFloat(e.target.value) || 0})}
                placeholder="30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedVolume">Volume Mensal Esperado</Label>
              <Input
                id="expectedVolume"
                type="number"
                min="1"
                value={formData.expectedVolume}
                onChange={(e) => setFormData({...formData, expectedVolume: parseFloat(e.target.value) || 1})}
                placeholder="100"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Preço Sugerido</h4>
                <p className="text-sm text-blue-700">
                  Baseado nos custos e margem informados
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">
                  R$ {calculatePrice().toFixed(2)}
                </div>
                <div className="text-sm text-blue-700">
                  por unidade
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">
          Calcular Precificação
        </Button>
      </div>
    </form>
  );
};

export default PricingForm;
