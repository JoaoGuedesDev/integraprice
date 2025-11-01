'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { HoverScale } from '@/components/ui/HoverScale';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface BasicFormData {
  productName: string;
  costPrice: number;
  desiredMargin: number;
  category: string;
}

interface BasicResults {
  sellingPrice: number;
  profit: number;
  marginPercentage: number;
}

const BasicPricingForm: React.FC = () => {
  const [formData, setFormData] = useState<BasicFormData>({
    productName: '',
    costPrice: 0,
    desiredMargin: 30,
    category: ''
  });

  const [results, setResults] = useState<BasicResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: keyof BasicFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculatePricing = () => {
    if (!formData.costPrice || formData.costPrice <= 0) return;

    setIsCalculating(true);
    
    setTimeout(() => {
      const marginMultiplier = 1 + (formData.desiredMargin / 100);
      const sellingPrice = formData.costPrice * marginMultiplier;
      const profit = sellingPrice - formData.costPrice;
      const marginPercentage = ((profit / sellingPrice) * 100);

      setResults({
        sellingPrice,
        profit,
        marginPercentage
      });
      setIsCalculating(false);
    }, 800);
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      costPrice: 0,
      desiredMargin: 30,
      category: ''
    });
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <Card className="modern-card">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calculator className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Calculadora Básica de Preços
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600">
              Calcule rapidamente o preço de venda ideal para seus produtos
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Nome do Produto</Label>
                <Input
                  id="productName"
                  placeholder="Ex: Produto A"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Eletrônicos</SelectItem>
                    <SelectItem value="clothing">Roupas</SelectItem>
                    <SelectItem value="food">Alimentação</SelectItem>
                    <SelectItem value="services">Serviços</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="costPrice">Custo do Produto (R$)</Label>
                <Input
                  id="costPrice"
                  type="number"
                  placeholder="0,00"
                  value={formData.costPrice || ''}
                  onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desiredMargin">Margem Desejada (%)</Label>
                <Input
                  id="desiredMargin"
                  type="number"
                  placeholder="30"
                  value={formData.desiredMargin}
                  onChange={(e) => handleInputChange('desiredMargin', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex gap-3">
              <HoverScale>
                <Button 
                  onClick={calculatePricing}
                  disabled={!formData.costPrice || isCalculating}
                  className="flex-1 btn-gradient"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calcular Preço
                    </>
                  )}
                </Button>
              </HoverScale>
              
              <Button variant="outline" onClick={resetForm}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {results && (
        <ScrollReveal delay={200}>
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Resultados da Calculadora
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Preço de Venda</p>
                  <p className="text-2xl font-bold text-primary">
                    R$ <AnimatedCounter value={results.sellingPrice} duration={1000} />
                  </p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-success/10 to-accent/10 rounded-lg border border-success/20">
                  <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Lucro por Unidade</p>
                  <p className="text-2xl font-bold text-success">
                    R$ <AnimatedCounter value={results.profit} duration={1000} />
                  </p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-warning/10 to-destructive/10 rounded-lg border border-warning/20">
                  <Badge variant="secondary" className="mb-2">Margem</Badge>
                  <p className="text-sm text-gray-600 mb-1">Margem de Lucro</p>
                  <p className="text-2xl font-bold text-amber-600">
                    <AnimatedCounter value={results.marginPercentage} duration={1000} />%
                  </p>
                </div>
              </div>

              {formData.productName && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Resumo do Produto</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Produto:</span>
                    <span className="font-medium">{formData.productName}</span>
                    <span className="text-gray-600">Categoria:</span>
                    <span className="font-medium">{formData.category || 'Não especificada'}</span>
                    <span className="text-gray-600">Custo:</span>
                    <span className="font-medium">R$ {formData.costPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>
      )}
    </div>
  );
};

export default BasicPricingForm;