'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Download, 
  Upload, 
  Trash2, 
  Eye, 
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface PricingHistoryItem {
  id: string;
  productName: string;
  finalPrice: number;
  margin: number;
  riskLevel: 'excellent' | 'low' | 'moderate' | 'high' | 'critical';
  createdAt: Date;
  inputs: any;
  results: any;
}

interface HistoryDisplayProps {
  history: PricingHistoryItem[];
  onClearHistory: () => void;
  onExportHistory: () => void;
  onImportHistory: (file: File) => void;
}

const getRiskIcon = (level: string) => {
  switch (level) {
    case 'excellent':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'low':
      return <CheckCircle className="h-4 w-4 text-blue-600" />;
    case 'moderate':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case 'high':
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    case 'critical':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-600" />;
  }
};

const getRiskLabel = (level: string) => {
  switch (level) {
    case 'excellent':
      return 'Excelente';
    case 'low':
      return 'Baixo';
    case 'moderate':
      return 'Moderado';
    case 'high':
      return 'Alto';
    case 'critical':
      return 'Crítico';
    default:
      return 'Indefinido';
  }
};

const getRiskColor = (level: string) => {
  switch (level) {
    case 'excellent':
      return 'bg-green-100 text-green-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'moderate':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function HistoryDisplay({ 
  history, 
  onClearHistory, 
  onExportHistory, 
  onImportHistory 
}: HistoryDisplayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<PricingHistoryItem | null>(null);

  const filteredHistory = history.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportHistory(file);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const currentDate = new Date().toISOString().split('T')[0];
    link.download = `integraprice-history-${currentDate}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Histórico de Precificações</span>
            </CardTitle>
            <CardDescription>
              Visualize e gerencie suas precificações anteriores
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={history.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearHistory}
              disabled={history.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <input
          id="file-upload"
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Barra de Pesquisa */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar por nome do produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista do Histórico */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {history.length === 0 
                ? 'Nenhuma precificação salva ainda.' 
                : 'Nenhum resultado encontrado para sua pesquisa.'
              }
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {history.length === 0 
                ? 'Complete uma precificação para começar seu histórico.'
                : 'Tente usar termos diferentes na pesquisa.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                      <Badge className={getRiskColor(item.riskLevel)}>
                        {getRiskIcon(item.riskLevel)}
                        <span className="ml-1">{getRiskLabel(item.riskLevel)}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Preço: {formatCurrency(item.finalPrice)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Margem: {item.margin.toFixed(2)}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedItem(item)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Detalhes da Precificação</DialogTitle>
                        <DialogDescription>
                          {selectedItem?.productName} - {selectedItem && formatDate(selectedItem.createdAt)}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedItem && (
                        <div className="space-y-6">
                          {/* Resumo */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Preço Final</p>
                              <p className="text-xl font-bold text-blue-600">
                                {formatCurrency(selectedItem.finalPrice)}
                              </p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Margem</p>
                              <p className="text-xl font-bold text-green-600">
                                {selectedItem.margin.toFixed(2)}%
                              </p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              {getRiskIcon(selectedItem.riskLevel)}
                              <p className="text-sm text-gray-600 mt-2">Nível de Risco</p>
                              <p className="text-lg font-bold">
                                {getRiskLabel(selectedItem.riskLevel)}
                              </p>
                            </div>
                          </div>

                          {/* Dados Detalhados */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-3">Dados de Entrada</h4>
                              <div className="space-y-2 text-sm">
                                <p><strong>Volume Esperado:</strong> {selectedItem.inputs?.expectedVolume || 'N/A'}</p>
                                <p><strong>Margem Desejada:</strong> {selectedItem.inputs?.desiredMargin || 'N/A'}%</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-3">Resultados</h4>
                              <div className="space-y-2 text-sm">
                                <p><strong>Receita Total:</strong> {selectedItem.results?.totalRevenue ? formatCurrency(selectedItem.results.totalRevenue) : 'N/A'}</p>
                                <p><strong>Lucro Total:</strong> {selectedItem.results?.totalProfit ? formatCurrency(selectedItem.results.totalProfit) : 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
