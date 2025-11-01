'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PricingResults } from '@/types';
import { DollarSign, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animations';

interface BasicResultsDisplayProps {
  results: PricingResults;
}

export function BasicResultsDisplay({ results }: BasicResultsDisplayProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Resultados da Precificação
        </CardTitle>
        <CardDescription>
          Resultado usando metodologia básica
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
            <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Preço de Venda</p>
            <p className="text-2xl font-bold text-primary">
              R$ <AnimatedCounter end={results.sellingPrice} duration={1000} />
            </p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-success/10 to-accent/10 rounded-lg border border-success/20">
            <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Lucro por Unidade</p>
            <p className="text-2xl font-bold text-success">
              R$ <AnimatedCounter end={results.profit} duration={1000} />
            </p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-warning/10 to-destructive/10 rounded-lg border border-warning/20">
            <Target className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Margem de Lucro</p>
            <p className="text-2xl font-bold text-warning">
              <AnimatedCounter end={results.marginPercentage} duration={1000} />%
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">Custo do Produto:</span>
            <span className="font-semibold">{formatCurrency(results.productCost)}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">Margem Aplicada:</span>
            <Badge variant="secondary">{results.marginPercentage.toFixed(1)}%</Badge>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border border-primary/20">
            <span className="text-sm font-medium text-primary">Preço Final:</span>
            <span className="font-bold text-primary text-lg">{formatCurrency(results.sellingPrice)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}