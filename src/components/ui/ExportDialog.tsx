'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Settings, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { PricingInputs, PricingResults, RiskAnalysis, StrategicRecommendation } from '@/types';
import { ExportOptions, ReportData, generateReportData, validateReportData } from '@/lib/export/reportGenerator';
import { PDFExporter } from '@/lib/export/pdfExporter';
import { ExcelExporter } from '@/lib/export/excelExporter';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pricingInputs: PricingInputs;
  pricingResults: PricingResults;
  riskAnalysis: RiskAnalysis | null;
  recommendations: StrategicRecommendation[];
}

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export function ExportDialog({
  isOpen,
  onClose,
  pricingInputs,
  pricingResults,
  riskAnalysis,
  recommendations
}: ExportDialogProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeRecommendations: true,
    includeRiskAnalysis: true,
    includeTaxBreakdown: true,
    template: 'standard'
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportError, setExportError] = useState<string>('');

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportStatus('idle');
      setExportError('');

      // Gerar dados do relatório
      const reportData = generateReportData(
        pricingInputs.productName,
        pricingInputs,
        pricingResults,
        riskAnalysis,
        recommendations,
        companyInfo.name ? companyInfo : undefined
      );

      // Validar dados
      const validation = validateReportData(reportData);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      let blob: Blob;
      let filename: string;

      // Exportar baseado no formato selecionado
      if (exportOptions.format === 'pdf') {
        const pdfExporter = new PDFExporter();
        blob = await pdfExporter.exportReport(reportData, exportOptions);
        filename = `relatorio-precificacao-${pricingInputs.productName.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      } else {
        const excelExporter = new ExcelExporter();
        blob = await excelExporter.exportReport(reportData, exportOptions);
        filename = `relatorio-precificacao-${pricingInputs.productName.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`;
      }

      // Download do arquivo
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportStatus('success');
      
      // Fechar diálogo após sucesso
      setTimeout(() => {
        onClose();
        setExportStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Erro na exportação:', error);
      setExportError(error instanceof Error ? error.message : 'Erro desconhecido na exportação');
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCompanyInfoChange = (key: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Relatório de Precificação
          </DialogTitle>
          <DialogDescription>
            Configure as opções de exportação para gerar um relatório profissional da análise de precificação.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Opções de Formato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Formato e Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Formato do Arquivo</Label>
                <RadioGroup
                  value={exportOptions.format}
                  onValueChange={(value: 'pdf' | 'excel') => handleOptionChange('format', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="pdf" />
                    <Label htmlFor="pdf" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF - Relatório Formatado
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excel" id="excel" />
                    <Label htmlFor="excel" className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel - Dados Estruturados
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium">Template do Relatório</Label>
                <RadioGroup
                  value={exportOptions.template}
                  onValueChange={(value: 'standard' | 'detailed' | 'executive') => handleOptionChange('template', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard">Padrão - Informações essenciais</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="detailed" id="detailed" />
                    <Label htmlFor="detailed">Detalhado - Análise completa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="executive" id="executive" />
                    <Label htmlFor="executive">Executivo - Resumo estratégico</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Opções de Conteúdo */}
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo do Relatório</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCharts"
                  checked={exportOptions.includeCharts}
                  onCheckedChange={(checked) => handleOptionChange('includeCharts', checked)}
                />
                <Label htmlFor="includeCharts">Incluir gráficos e visualizações</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTaxBreakdown"
                  checked={exportOptions.includeTaxBreakdown}
                  onCheckedChange={(checked) => handleOptionChange('includeTaxBreakdown', checked)}
                />
                <Label htmlFor="includeTaxBreakdown">Incluir análise tributária detalhada</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeRiskAnalysis"
                  checked={exportOptions.includeRiskAnalysis}
                  onCheckedChange={(checked) => handleOptionChange('includeRiskAnalysis', checked)}
                />
                <Label htmlFor="includeRiskAnalysis">Incluir análise de risco</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeRecommendations"
                  checked={exportOptions.includeRecommendations}
                  onCheckedChange={(checked) => handleOptionChange('includeRecommendations', checked)}
                />
                <Label htmlFor="includeRecommendations">Incluir recomendações estratégicas</Label>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Empresa */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Informações da Empresa (Opcional)
              </CardTitle>
              <CardDescription>
                Adicione informações da sua empresa para personalizar o relatório.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  value={companyInfo.name}
                  onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                  placeholder="Sua Empresa Ltda."
                />
              </div>

              <div>
                <Label htmlFor="companyEmail">E-mail</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                  placeholder="contato@empresa.com"
                />
              </div>

              <div>
                <Label htmlFor="companyPhone">Telefone</Label>
                <Input
                  id="companyPhone"
                  value={companyInfo.phone}
                  onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="companyAddress">Endereço</Label>
                <Textarea
                  id="companyAddress"
                  value={companyInfo.address}
                  onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                  placeholder="Rua Example, 123 - São Paulo, SP"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status da Exportação */}
        {exportStatus !== 'idle' && (
          <div className="mt-4">
            {exportStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <span>Relatório exportado com sucesso!</span>
              </div>
            )}
            
            {exportStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span>Erro na exportação: {exportError}</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar {exportOptions.format.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}