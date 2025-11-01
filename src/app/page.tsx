'use client';

import { useState } from 'react';
import { PricingInputs, PricingResults, RiskAnalysis, StrategicRecommendation, PricingHistory, BasicCalculationResult } from '@/types';
import { calculatePricing, analyzeRisk, generateStrategicRecommendations } from '@/lib/calculations/pricing';
import { calculateBasicPrice } from '@/lib/calculations/basicCalculations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { PriceCompositionChart } from '@/components/charts/PriceCompositionChart';
import { ExportDialog } from '@/components/ui/ExportDialog';
import { PricingForm } from '@/components/forms/PricingForm';
import { EnhancedPricingForm } from '@/components/forms/EnhancedPricingForm';
import BasicPricingForm from '@/components/forms/BasicPricingForm';
import { AdvancedPricingForm } from '@/components/forms/AdvancedPricingForm';
import { ResultsDisplay } from '@/components/charts/ResultsDisplay';
import { BasicResultsDisplay } from '@/components/charts/BasicResultsDisplay';
import { RecommendationsCard } from '@/components/charts/RecommendationsCard';
import { HistoryDisplay } from '@/components/charts/HistoryDisplay';
import { usePricingHistory } from '@/hooks/usePricingHistory';
import { useTheme } from '@/contexts/ThemeContext';
import { AlertTriangle, CheckCircle, TrendingUp, BarChart3, XCircle, Calculator, ArrowLeft, History, Plus, Settings, Sparkles, Download, Building2, Zap, Target, PieChart, Users, Award, Lightbulb, ArrowRight } from 'lucide-react';
import { LogoIcon, PricingIcon, AnalyticsIcon, BusinessIcon, FloatingElements } from '@/components/ui/icons'
import { HeroIllustration, CalculatorIllustration, AnalyticsIllustration } from '@/components/ui/illustrations'
import { AnimatedCounter, ScrollReveal, HoverScale, PageTransition, FloatingParticles } from '@/components/ui/animations';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'input' | 'results' | 'history'>('welcome');
  const [calculationMethod, setCalculationMethod] = useState<'advanced' | 'basic'>('basic');
  const [pricingInputs, setPricingInputs] = useState<PricingInputs | null>(null);
  const [pricingResults, setPricingResults] = useState<PricingResults | null>(null);
  const [basicResults, setBasicResults] = useState<BasicCalculationResult | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<StrategicRecommendation[]>([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  const { history, addToHistory, clearHistory, exportHistory, importHistory } = usePricingHistory();
  const { currentTheme } = useTheme();

  const handleBasicCalculate = (inputs: any) => {
    try {
      const results = calculateBasicPrice(inputs);
      setBasicResults(results);
      setCurrentStep('results');
    } catch (error) {
      console.error('Erro no cálculo básico:', error);
    }
  };

  const handleCalculate = async (formData: any) => {
    // Simular um pequeno delay para mostrar loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Transformar dados do formulário simples para PricingInputs
    const inputs: PricingInputs = {
      productName: formData.productName,
      fixedCosts: [{
        id: 'fixed-1',
        name: 'Custos Fixos Mensais',
        value: formData.fixedCost,
        category: 'other'
      }],
      variableCosts: [{
        id: 'variable-1',
        name: 'Custo Variável por Unidade',
        valuePerUnit: formData.variableCost,
        category: 'other'
      }],
      taxes: [], // Sem impostos por enquanto
      desiredMargin: formData.targetMargin,
      expectedVolume: formData.expectedVolume
    };
    
    // Calcular precificação
    const results = calculatePricing(inputs);
    
    // Analisar riscos
    const risk = analyzeRisk(results, inputs);
    
    // Gerar recomendações estratégicas
    const strategicRecs = generateStrategicRecommendations(results, inputs, risk);
    
    // Salvar no histórico usando o hook
    addToHistory(inputs, results, risk, strategicRecs);
    
    // Atualizar estados
    setPricingInputs(inputs);
    setPricingResults(results);
    setRiskAnalysis(risk);
    setRecommendations(strategicRecs);
    setCurrentStep('results');
  };

  const handleNewCalculation = () => {
    setCurrentStep('input');
    setPricingInputs(null);
    setPricingResults(null);
    setRiskAnalysis(null);
    setRecommendations([]);
  };

  const handleLoadHistory = (historyItem: PricingHistory) => {
    setPricingInputs(historyItem.inputs);
    setPricingResults(historyItem.results);
    setRiskAnalysis(historyItem.riskAnalysis);
    setRecommendations(historyItem.recommendations);
    setCurrentStep('results');
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-600';
      case 'low': return 'text-blue-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'excellent': return <CheckCircle className="h-5 w-5" />;
      case 'low': return <TrendingUp className="h-5 w-5" />;
      case 'moderate': return <BarChart3 className="h-5 w-5" />;
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'critical': return <XCircle className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  const features = [
    {
      icon: Calculator,
      title: "Cálculos Precisos",
      description: "Algoritmos avançados para precificação estratégica",
      color: "text-blue-500"
    },
    {
      icon: Building2,
      title: "Cálculo Simplificado",
      description: "Método rápido e eficiente para pequenos negócios",
      color: "text-purple-500"
    },
    {
      icon: BarChart3,
      title: "Análise Completa",
      description: "Relatórios detalhados e visualizações interativas",
      color: "text-teal-500"
    },
    {
      icon: Target,
      title: "Estratégias Personalizadas",
      description: "Recomendações baseadas no seu mercado",
      color: "text-orange-500"
    }
  ];

  const stats = [
    { label: "Empresas Atendidas", value: 10000, suffix: "+", icon: Users },
    { label: "Precisão", value: 99.9, suffix: "%", icon: Award },
    { label: "Economia Média", value: 25, suffix: "%", icon: TrendingUp },
    { label: "Satisfação", value: 4.9, suffix: "/5", icon: Sparkles }
  ];

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen animated-bg relative">
        <FloatingElements />
        
        {/* Header */}
        <header className="relative z-10 px-4 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <LogoIcon size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  IntegraPricing
                </h1>
                <p className="text-sm text-muted-foreground">Sistema Inteligente de Precificação</p>
              </div>
            </div>
            <ThemeSelector />
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative z-10 px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Hero Content */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="animate-fade-in">
                <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span>Powered by AI & Advanced Analytics</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                    Precificação
                  </span>
                  <br />
                  <span className="text-foreground">Inteligente</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Transforme sua estratégia de preços com nossa plataforma avançada. 
                  Combine metodologias comprovadas com inteligência artificial para 
                  maximizar sua lucratividade.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="btn-gradient text-lg px-8 py-4 h-auto hover-lift"
                    onClick={() => setCurrentStep('input')}
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Começar Agora
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-4 h-auto hover-lift"
                    onClick={() => setCurrentStep('history')}
                  >
                    <History className="h-5 w-5 mr-2" />
                    Ver Histórico
                  </Button>
                </div>
              </div>
              
              <div className="animate-slide-in-right">
                <HeroIllustration className="w-full h-auto" />
              </div>
            </div>

            {/* Stats */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {stats.map((stat, index) => (
                  <HoverScale key={index}>
                    <Card className="modern-card text-center">
                      <CardContent className="pt-6">
                        <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <div className="text-2xl font-bold text-foreground mb-1">
                          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                        </div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </HoverScale>
                ))}
              </div>
            </ScrollReveal>

            {/* Features */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {features.map((feature, index) => (
                  <HoverScale key={index}>
                    <Card className="modern-card group">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 mb-4 group-hover:scale-110 transition-transform">
                          <feature.icon className={`h-6 w-6 ${feature.color}`} />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </HoverScale>
                ))}
              </div>
            </ScrollReveal>

            {/* Visual Features Section */}
            <ScrollReveal direction="up" delay={0.6}>
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <HoverScale>
                  <Card className="modern-card text-center p-6">
                    <CalculatorIllustration className="mx-auto mb-4" width={120} height={120} />
                    <h3 className="text-xl font-semibold mb-2">Cálculos Precisos</h3>
                    <p className="text-muted-foreground">
                      Algoritmos avançados garantem precisão matemática em todos os cálculos
                    </p>
                  </Card>
                </HoverScale>
                
                <HoverScale>
                  <Card className="modern-card text-center p-6">
                    <AnalyticsIllustration className="mx-auto mb-4" width={120} height={120} />
                    <h3 className="text-xl font-semibold mb-2">Análise Completa</h3>
                    <p className="text-muted-foreground">
                      Visualizações interativas e relatórios detalhados para tomada de decisão
                    </p>
                  </Card>
                </HoverScale>
                
                <HoverScale>
                  <Card className="modern-card text-center p-6">
                    <div className="flex justify-center mb-4">
                      <BusinessIcon size={120} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Cálculo Simplificado</h3>
                    <p className="text-muted-foreground">
                      Método rápido e eficiente para pequenos e médios negócios
                    </p>
                  </Card>
                </HoverScale>
              </div>
            </ScrollReveal>

            {/* CTA Section */}
            <ScrollReveal direction="up" delay={0.8}>
              <Card className="modern-card text-center p-8 relative overflow-hidden">
                <FloatingParticles count={15} className="opacity-30" />
                <div className="max-w-2xl mx-auto relative z-10">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h2 className="text-3xl font-bold mb-4">Pronto para Revolucionar seus Preços?</h2>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Junte-se a milhares de empresas que já transformaram sua precificação 
                    com nossa plataforma inteligente.
                  </p>
                  <HoverScale>
                    <Button 
                      size="lg" 
                      className="btn-gradient text-lg px-8 py-4 h-auto"
                      onClick={() => setCurrentStep('input')}
                    >
                      <PricingIcon size={20} className="mr-2" />
                      Iniciar Cálculo Gratuito
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </HoverScale>
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </main>
      </div>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-background">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep('welcome')}
              className="hover-lift"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <LogoIcon size={16} className="text-white" />
            </div>
              <span className="font-semibold">IntegraPricing</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="hidden sm:flex">
              {currentStep === 'input' ? 'Configuração' : 
               currentStep === 'results' ? 'Resultados' : 'Histórico'}
            </Badge>
            <ThemeSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        {currentStep === 'history' ? (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Histórico de Cálculos</h1>
                <p className="text-muted-foreground">Acompanhe seus cálculos anteriores</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentStep('welcome')}
                className="hover-lift"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
            <HistoryDisplay 
              history={history.map(item => ({
                id: item.id,
                productName: item.inputs.productName,
                finalPrice: item.results.idealPrice,
                margin: item.results.actualMargin,
                riskLevel: item.riskAnalysis.level,
                createdAt: new Date(item.date),
                inputs: item.inputs,
                results: item.results
              }))}
              onClearHistory={clearHistory}
              onExportHistory={exportHistory}
              onImportHistory={importHistory}
            />
          </div>
        ) : currentStep === 'input' ? (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Configure sua Precificação</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Escolha o método que melhor se adapta ao seu negócio e configure os parâmetros
              </p>
            </div>

            <Tabs value={calculationMethod} onValueChange={(value) => setCalculationMethod(value as 'advanced' | 'basic')} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
                  <TabsTrigger value="basic" className="flex items-center space-x-2 text-sm">
                    <Calculator className="h-4 w-4" />
                    <span>Método Básico</span>
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="flex items-center space-x-2 text-sm">
                    <Building2 className="h-4 w-4" />
                    <span>Método Avançado</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="basic" className="animate-slide-up">
                <Card className="modern-card">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center space-x-2">
                      <Calculator className="h-5 w-5 text-primary" />
                      <span>Precificação Básica</span>
                    </CardTitle>
                    <CardDescription>
                      Método rápido e simples para cálculos essenciais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BasicPricingForm onCalculate={handleBasicCalculate} isLoading={false} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="advanced" className="animate-slide-up">
                <Card className="modern-card">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center space-x-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <span>Precificação Avançada</span>
                    </CardTitle>
                    <CardDescription>
                      Método completo com análise de riscos e recomendações estratégicas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EnhancedPricingForm onCalculate={handleCalculate} isLoading={false} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewCalculation}
                  className="hover-lift"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Nova Análise
                </Button>
                <Badge variant="secondary" className="flex items-center space-x-1 success-state">
                  <CheckCircle className="h-3 w-3" />
                  <span>Cálculo Concluído</span>
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep('history')}
                  className="hover-lift"
                >
                  <History className="h-4 w-4 mr-2" />
                  Histórico
                </Button>
                <Button
                  onClick={() => setShowExportDialog(true)}
                  className="hover-lift"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            {calculationMethod === 'basic' && basicResults ? (
              <BasicResultsDisplay results={basicResults} />
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  {pricingResults && pricingInputs && (
                    <ResultsDisplay 
                      results={pricingResults} 
                      inputs={pricingInputs} 
                    />
                  )}

                  {recommendations.length > 0 && (
                    <RecommendationsCard 
                      recommendations={recommendations.map(rec => ({
                        type: rec.type === 'cost_reduction' ? 'cost' : 
                              rec.type === 'process_optimization' ? 'strategy' : 
                              rec.type === 'premium_positioning' ? 'pricing' : 'strategy',
                        priority: rec.impact === 'high' ? 'high' : 
                                 rec.impact === 'medium' ? 'medium' : 'low',
                        impact: rec.impact === 'high' ? 'high' : 
                               rec.impact === 'medium' ? 'medium' : 'low',
                        title: rec.title,
                        description: rec.description,
                        actionItems: rec.actionItems || ['Implementar as melhorias sugeridas', 'Monitorar os resultados']
                      }))}
                    />
                  )}
                </div>
                <div className="space-y-6">
                  {pricingResults && (
                    <PriceCompositionChart 
                      results={pricingResults}
                      className="h-full"
                    />
                  )}

                  {riskAnalysis && (
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                          {getRiskIcon(riskAnalysis.level)}
                          <span>Análise de Risco</span>
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Avaliação dos riscos associados à precificação
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Nível de Risco:
                            </span>
                            <span className={`text-sm font-bold ${getRiskColor(riskAnalysis.level)}`}>
                              {riskAnalysis.level.toUpperCase()}
                            </span>
                          </div>

                          {riskAnalysis.factors && riskAnalysis.factors.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Fatores de Risco:
                              </h4>
                              <ul className="space-y-1">
                                {riskAnalysis.factors.map((factor, index) => (
                                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                                    <span className="text-orange-500 mr-2">•</span>
                                    {factor}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

        {/* Export Dialog */}
        {showExportDialog && pricingInputs && pricingResults && (
          <ExportDialog
            isOpen={showExportDialog}
            onClose={() => setShowExportDialog(false)}
            pricingInputs={pricingInputs}
            pricingResults={pricingResults}
            riskAnalysis={riskAnalysis}
            recommendations={recommendations}
          />
        )}
      </PageTransition>
    );
}

