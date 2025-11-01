'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  AlertTriangle, 
  Lightbulb, 
  BarChart3,
  PieChart,
  Shield,
  Zap
} from 'lucide-react';

interface RecommendationItem {
  type: 'pricing' | 'cost' | 'margin' | 'risk' | 'strategy';
  priority: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
}

interface RecommendationsCardProps {
  recommendations: RecommendationItem[];
}

const getTypeConfig = (type: string) => {
  switch (type) {
    case 'pricing':
      return {
        icon: DollarSign,
        label: 'Precificação',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    case 'cost':
      return {
        icon: BarChart3,
        label: 'Custos',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    case 'margin':
      return {
        icon: TrendingUp,
        label: 'Margem',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      };
    case 'risk':
      return {
        icon: Shield,
        label: 'Risco',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    case 'strategy':
      return {
        icon: Target,
        label: 'Estratégia',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200'
      };
    default:
      return {
        icon: Lightbulb,
        label: 'Geral',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      };
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high':
      return 'bg-purple-100 text-purple-800';
    case 'medium':
      return 'bg-blue-100 text-blue-800';
    case 'low':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'Alta';
    case 'medium':
      return 'Média';
    case 'low':
      return 'Baixa';
    default:
      return 'Indefinida';
  }
};

const getImpactLabel = (impact: string) => {
  switch (impact) {
    case 'high':
      return 'Alto';
    case 'medium':
      return 'Médio';
    case 'low':
      return 'Baixo';
    default:
      return 'Indefinido';
  }
};

export default function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  // Agrupar recomendações por tipo
  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.type]) {
      acc[rec.type] = [];
    }
    acc[rec.type].push(rec);
    return acc;
  }, {} as Record<string, RecommendationItem[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <CardTitle>Recomendações Estratégicas</CardTitle>
        </div>
        <CardDescription>
          Sugestões para otimizar sua precificação e reduzir riscos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(groupedRecommendations).length === 0 ? (
          <div className="text-center py-8">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma recomendação disponível no momento.</p>
            <p className="text-sm text-gray-400 mt-2">
              Complete a precificação para receber sugestões personalizadas.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedRecommendations).map(([type, items]) => {
              const config = getTypeConfig(type);
              const IconComponent = config.icon;

              return (
                <div key={type} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-4 w-4 ${config.color}`} />
                    <h3 className={ont-semibold }>{config.label}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div 
                        key={index} 
                        className="p-4 rounded-lg border"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <div className="flex space-x-2">
                            <Badge className={getPriorityColor(item.priority)}>
                              {getPriorityLabel(item.priority)}
                            </Badge>
                            <Badge className={getImpactColor(item.impact)}>
                              Impacto {getImpactLabel(item.impact)}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          {item.description}
                        </p>
                        
                        {item.actionItems.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                              Ações Recomendadas:
                            </h5>
                            <ul className="space-y-1">
                              {item.actionItems.map((action, actionIndex) => (
                                <li 
                                  key={actionIndex} 
                                  className="text-sm text-gray-600 flex items-start space-x-2"
                                >
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


