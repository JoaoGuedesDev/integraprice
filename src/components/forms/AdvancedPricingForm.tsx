'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, DollarSign, BarChart3, Settings, Target } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { HoverScale } from '@/components/ui/HoverScale';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface AdvancedFormData {
  productName: string;
  costPrice: number;
  desiredMargin: number;
  category: string;
  fixedCosts: number;
  variableCosts: number;
  competitorPrice: number;
  marketDemand: string;
  seasonality: string;
  targetVolume: number;
}

interface AdvancedResults {
  sellingPrice: number;
  profit: number;
  marginPercentage: number;
  breakEvenPoint: number;
  competitiveAnalysis: string;
  recommendations: string[];
  totalCosts: number;
  roi: number;
}

const AdvancedPricingForm: React.FC = () => {
  const [formData, setFormData] = useState<AdvancedFormData>({
    productName: '',
    costPrice: 0,
    desiredMargin: 30,
    category: '',
    fixedCosts: 0,
    variableCosts: 0,
    competitorPrice: 0,
    marketDemand: '',
    seasonality: '',
    targetVolume: 0
  });

  const [results, setResults] = useState<AdvancedResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: keyof AdvancedFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateAdvancedPricing = () => {
    if (!formData.costPrice || formData.costPrice <= 0) return;

    setIsCalculating(true);
    
    setTimeout(() => {
      const totalCosts = formData.costPrice + formData.fixedCosts + formData.variableCosts;
      const marginMultiplier = 1 + (formData.desiredMargin / 100);
      const baseSellingPrice = totalCosts * marginMultiplier;
      
      // Ajustes baseados em fatores de mercado
      let adjustedPrice = baseSellingPrice;
      
      // Ajuste por demanda
      if (formData.marketDemand === 'high') {
        adjustedPrice *= 1.1;
      } else if (formData.marketDemand === 'low') {
        adjustedPrice *= 0.95;
      }
      
      // Ajuste por sazonalidade
      if (formData.seasonality === 'peak') {
        adjustedPrice *= 1.15;
      } else if (formData.seasonality === 'low') {
        adjustedPrice *= 0.9;
      }

      const profit = adjustedPrice - totalCosts;
      const marginPercentage = ((profit / adjustedPrice) * 100);
      const breakEvenPoint = formData.fixedCosts / (adjustedPrice - formData.costPrice - formData.variableCosts);
      const roi = ((profit * formData.targetVolume) / (formData.fixedCosts || 1)) * 100;

      // Análise competitiva
      let competitiveAnalysis = '';
      if (formData.competitorPrice > 0) {
        const priceDiff = ((adjustedPrice - formData.competitorPrice) / formData.competitorPrice) * 100;
        if (priceDiff > 10) {
          competitiveAnalysis = 'Preço acima da concorrência - considere estratégia de diferenciação';
        } else if (priceDiff < -10) {
          competitiveAnalysis = 'Preço abaixo da concorrência - oportunidade de aumentar margem';
        } else {
          competitiveAnalysis = 'Preço competitivo no mercado';
        }
      }

      // Recomendações
      const recommendations = [];
      if (marginPercentage < 20) {
        recommendations.push('Margem baixa - considere reduzir custos ou aumentar preço');
      }
      if (breakEvenPoint > 100) {
        recommendations.push('Ponto de equilíbrio alto - revise custos fixos');
      }
      if (formData.marketDemand === 'high' && marginPercentage < 30) {
        recommendations.push('Alta demanda permite margem maior');
      }
      if (roi < 50) {
        recommendations.push('ROI baixo - otimize custos ou volume de vendas');
      }

      setResults({
        sellingPrice: adjustedPrice,
        profit,
        marginPercentage,
        breakEvenPoint,
        competitiveAnalysis,
        recommendations,
        totalCosts,
        roi
      });
      setIsCalculating(false);
    }, 1200);
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      costPrice: 0,
      desiredMargin: 30,
      category: '',
      fixedCosts: 0,
      variableCosts: 0,
      competitorPrice: 0,
      marketDemand: '',
      seasonality: '',
      targetVolume: 0
    });
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <Card className="modern-card">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Settings className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Calculadora Avançada de Preços
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600">
              Análise completa com fatores de mercado, custos detalhados e estratégias competitivas
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
                <TabsTrigger value="costs">Custos Detalhados</TabsTrigger>
                <TabsTrigger value="market">Análise de Mercado</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Nome do Produto</Label>
                    <Input
                      id="productName"
                      placeholder="Ex: Produto Premium"
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
                        <SelectItem value="luxury">Produtos de Luxo</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="other">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Custo Base do Produto (R$)</Label>
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
              </TabsContent>

              <TabsContent value="costs" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fixedCosts">Custos Fixos (R$)</Label>
                    <Input
                      id="fixedCosts"
                      type="number"
                      placeholder="0,00"
                      value={formData.fixedCosts || ''}
                      onChange={(e) => handleInputChange('fixedCosts', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-gray-500">Aluguel, salários, etc.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variableCosts">Custos Variáveis (R$)</Label>
                    <Input
                      id="variableCosts"
                      type="number"
                      placeholder="0,00"
                      value={formData.variableCosts || ''}
                      onChange={(e) => handleInputChange('variableCosts', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-gray-500">Comissões, embalagem, etc.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetVolume">Volume Alvo (unidades/mês)</Label>
                    <Input
                      id="targetVolume"
                      type="number"
                      placeholder="100"
                      value={formData.targetVolume || ''}
                      onChange={(e) => handleInputChange('targetVolume', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="market" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="competitorPrice">Preço da Concorrência (R$)</Label>
                    <Input
                      id="competitorPrice"
                      type="number"
                      placeholder="0,00"
                      value={formData.competitorPrice || ''}
                      onChange={(e) => handleInputChange('competitorPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marketDemand">Demanda do Mercado</Label>
                    <Select value={formData.marketDemand} onValueChange={(value) => handleInputChange('marketDemand', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a demanda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seasonality">Sazonalidade</Label>
                    <Select value={formData.seasonality} onValueChange={(value) => handleInputChange('seasonality', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a sazonalidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa temporada</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="peak">Alta temporada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <div className="flex gap-3">
              <HoverScale>
                <Button 
                  onClick={calculateAdvancedPricing}
                  disabled={!formData.costPrice || isCalculating}
                  className="flex-1 btn-gradient"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calcular Preço Avançado
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Resultados Financeiros
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                    <DollarSign className="h-6 w-6 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground mb-1">Preço de Venda</p>
                    <p className="text-lg font-bold text-primary">
                      R$ <AnimatedCounter value={results.sellingPrice} duration={1000} />
                    </p>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-success/10 to-accent/10 rounded-lg border border-success/20">
                    <TrendingUp className="h-6 w-6 text-success mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground mb-1">Lucro Unitário</p>
                    <p className="text-lg font-bold text-success">
                      R$ <AnimatedCounter value={results.profit} duration={1000} />
                    </p>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-warning/10 to-destructive/10 rounded-lg border border-warning/20">
                    <Target className="h-6 w-6 text-warning mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground mb-1">Margem (%)</p>
                    <p className="text-lg font-bold text-warning">
                      <AnimatedCounter value={results.marginPercentage} duration={1000} />%
                    </p>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg border border-secondary/20">
                    <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 mb-1">ROI (%)</p>
                    <p className="text-lg font-bold text-purple-600">
                      <AnimatedCounter value={results.roi} duration={1000} />%
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Custo Total:</span>
                    <span className="font-medium">R$ {results.totalCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ponto de Equilíbrio:</span>
                    <span className="font-medium">{Math.ceil(results.breakEvenPoint)} unidades</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Análise Estratégica
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {results.competitiveAnalysis && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-1">Análise Competitiva</h4>
                    <p className="text-sm text-blue-700">{results.competitiveAnalysis}</p>
                  </div>
                )}

                {results.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">Recomendações</h4>
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-amber-50 rounded border border-amber-200">
                        <Badge variant="secondary" className="text-xs">
                          {index + 1}
                        </Badge>
                        <p className="text-sm text-amber-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                )}

                {formData.productName && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Resumo do Produto</h4>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Produto:</span>
                        <span className="font-medium">{formData.productName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Categoria:</span>
                        <span className="font-medium">{formData.category || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Volume Alvo:</span>
                        <span className="font-medium">{formData.targetVolume} un/mês</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
};

export default AdvancedPricingForm;