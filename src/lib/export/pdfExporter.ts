import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ReportData, ExportOptions, formatCurrency, formatPercentage, formatDate, generateExecutiveSummary, calculateReportMetrics, prepareChartData } from './reportGenerator';

// Extensão do tipo jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export class PDFExporter {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;
  private currentY: number = 20;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  // Função principal para exportar relatório em PDF
  async exportReport(data: ReportData, options: ExportOptions): Promise<Blob> {
    try {
      this.setupDocument();
      
      // Cabeçalho
      this.addHeader(data);
      
      // Resumo executivo
      if (options.template === 'executive' || options.template === 'detailed') {
        this.addExecutiveSummary(data);
      }
      
      // Informações do produto
      this.addProductInfo(data);
      
      // Resultados financeiros
      this.addFinancialResults(data);
      
      // Breakdown de custos
      this.addCostBreakdown(data);
      
      // Análise tributária
      if (options.includeTaxBreakdown) {
        this.addTaxAnalysis(data);
      }
      
      // Análise de risco
      if (options.includeRiskAnalysis) {
        this.addRiskAnalysis(data);
      }
      
      // Recomendações
      if (options.includeRecommendations) {
        this.addRecommendations(data);
      }
      
      // Rodapé
      this.addFooter(data);
      
      return new Blob([this.doc.output('blob')], { type: 'application/pdf' });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw new Error('Falha na geração do relatório PDF');
    }
  }

  private setupDocument(): void {
    this.doc.setProperties({
      title: 'Relatório de Precificação - IntegraPricing',
      subject: 'Análise Detalhada de Precificação',
      author: 'IntegraPricing System',
      creator: 'IntegraPricing'
    });
  }

  private addHeader(data: ReportData): void {
    // Logo e título
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('IntegraPricing', this.margin, this.currentY);
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Relatório de Análise de Precificação', this.margin, this.currentY + 10);
    
    // Informações da empresa (se disponível)
    if (data.companyInfo) {
      this.doc.setFontSize(10);
      this.doc.text(data.companyInfo.name || '', this.pageWidth - this.margin - 60, this.currentY);
      if (data.companyInfo.address) {
        this.doc.text(data.companyInfo.address, this.pageWidth - this.margin - 60, this.currentY + 5);
      }
    }
    
    // Data de geração
    this.doc.setFontSize(10);
    this.doc.text(`Gerado em: ${formatDate(data.generatedAt)}`, this.margin, this.currentY + 20);
    
    // Linha separadora
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, this.currentY + 25, this.pageWidth - this.margin, this.currentY + 25);
    
    this.currentY += 35;
  }

  private addExecutiveSummary(data: ReportData): void {
    const summary = generateExecutiveSummary(data);
    
    this.checkPageBreak(60);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Resumo Executivo', this.margin, this.currentY);
    this.currentY += 10;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    // Principais descobertas
    this.doc.text('Principais Resultados:', this.margin, this.currentY);
    this.currentY += 5;
    
    summary.keyFindings.forEach((finding, index) => {
      this.doc.text(`• ${finding}`, this.margin + 5, this.currentY);
      this.currentY += 5;
    });
    
    this.currentY += 5;
  }

  private addProductInfo(data: ReportData): void {
    this.checkPageBreak(40);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Informações do Produto', this.margin, this.currentY);
    this.currentY += 10;
    
    const productData = [
      ['Nome do Produto', data.productName],
      ['Volume Esperado', `${data.inputs.expectedVolume.toLocaleString('pt-BR')} unidades`],
      ['Margem Desejada', formatPercentage(data.inputs.desiredMargin)],
      ['Total de Custos Fixos', `${data.inputs.fixedCosts.length} itens`],
      ['Total de Custos Variáveis', `${data.inputs.variableCosts.length} itens`],
      ['Total de Impostos', `${data.inputs.taxes.length} itens`]
    ];
    
    this.doc.autoTable({
      startY: this.currentY,
      head: [['Atributo', 'Valor']],
      body: productData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: this.margin, right: this.margin }
    });
    
    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addFinancialResults(data: ReportData): void {
    this.checkPageBreak(80);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Resultados Financeiros', this.margin, this.currentY);
    this.currentY += 10;
    
    const metrics = calculateReportMetrics(data.results);
    
    const financialData = [
      ['Custo Unitário Total', formatCurrency(data.results.totalCostPerUnit)],
      ['Preço Mínimo', formatCurrency(data.results.minimumPrice)],
      ['Preço Ideal', formatCurrency(data.results.idealPrice)],
      ['Preço Final Recomendado', formatCurrency(data.results.finalPrice)],
      ['Margem Real', formatPercentage(data.results.actualMargin)],
      ['Margem Líquida', formatPercentage(data.results.netMargin)],
      ['Ponto de Equilíbrio', `${metrics.breakEvenUnits} unidades`],
      ['Receita Total Projetada', formatCurrency(data.results.totalRevenue)],
      ['Lucro Total Projetado', formatCurrency(data.results.totalProfit)],
      ['ROI Estimado', formatPercentage(metrics.roi)]
    ];
    
    this.doc.autoTable({
      startY: this.currentY,
      head: [['Métrica', 'Valor']],
      body: financialData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [40, 167, 69] },
      margin: { left: this.margin, right: this.margin }
    });
    
    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addCostBreakdown(data: ReportData): void {
    this.checkPageBreak(100);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Detalhamento de Custos', this.margin, this.currentY);
    this.currentY += 10;
    
    // Custos Fixos
    if (data.inputs.fixedCosts.length > 0) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Custos Fixos:', this.margin, this.currentY);
      this.currentY += 5;
      
      const fixedCostsData = data.inputs.fixedCosts.map(cost => [
        cost.name,
        cost.category,
        formatCurrency(cost.value),
        formatCurrency(cost.value / data.inputs.expectedVolume)
      ]);
      
      this.doc.autoTable({
        startY: this.currentY,
        head: [['Item', 'Categoria', 'Valor Total', 'Valor por Unidade']],
        body: fixedCostsData,
        theme: 'striped',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [220, 53, 69] },
        margin: { left: this.margin, right: this.margin }
      });
      
      this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
    }
    
    // Custos Variáveis
    if (data.inputs.variableCosts.length > 0) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Custos Variáveis:', this.margin, this.currentY);
      this.currentY += 5;
      
      const variableCostsData = data.inputs.variableCosts.map(cost => [
        cost.name,
        cost.category,
        formatCurrency(cost.valuePerUnit),
        formatCurrency(cost.valuePerUnit * data.inputs.expectedVolume)
      ]);
      
      this.doc.autoTable({
        startY: this.currentY,
        head: [['Item', 'Categoria', 'Valor por Unidade', 'Valor Total']],
        body: variableCostsData,
        theme: 'striped',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [255, 193, 7] },
        margin: { left: this.margin, right: this.margin }
      });
      
      this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
    }
  }

  private addTaxAnalysis(data: ReportData): void {
    if (!data.results.taxCalculations || data.results.taxCalculations.length === 0) return;
    
    this.checkPageBreak(80);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Análise Tributária', this.margin, this.currentY);
    this.currentY += 10;
    
    const taxData = data.results.taxCalculations.map(tax => [
      tax.name,
      tax.category,
      formatPercentage(tax.percentage),
      formatCurrency(tax.calculationBase),
      formatCurrency(tax.taxAmount),
      tax.isIncluded ? 'Incluso' : 'Excluso'
    ]);
    
    this.doc.autoTable({
      startY: this.currentY,
      head: [['Imposto', 'Categoria', 'Alíquota', 'Base de Cálculo', 'Valor', 'Tipo']],
      body: taxData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [108, 117, 125] },
      margin: { left: this.margin, right: this.margin }
    });
    
    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
    
    // Resumo tributário
    const taxSummary = [
      ['Total de Impostos Inclusos', formatCurrency(data.results.totalIncludedTaxes)],
      ['Total de Impostos Exclusos', formatCurrency(data.results.totalExcludedTaxes)],
      ['Carga Tributária Efetiva', formatPercentage(data.results.effectiveTaxRate)],
      ['Preço sem Impostos', formatCurrency(data.results.priceWithoutTaxes)]
    ];
    
    this.doc.autoTable({
      startY: this.currentY,
      head: [['Resumo Tributário', 'Valor']],
      body: taxSummary,
      theme: 'plain',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [248, 249, 250] },
      margin: { left: this.margin, right: this.margin }
    });
    
    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addRiskAnalysis(data: ReportData): void {
    this.checkPageBreak(60);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Análise de Risco', this.margin, this.currentY);
    this.currentY += 10;
    
    if (!data.riskAnalysis) {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('Análise de risco não disponível para este produto.', this.margin, this.currentY);
      this.currentY += 15;
      return;
    }
    
    // Nível de risco
    this.doc.setFontSize(12);
    this.doc.text(`Nível de Risco: ${data.riskAnalysis.level.toUpperCase()}`, this.margin, this.currentY);
    this.doc.text(`Score: ${data.riskAnalysis.score}/100`, this.margin + 100, this.currentY);
    this.currentY += 10;
    
    // Fatores de risco
    if (data.riskAnalysis.factors && data.riskAnalysis.factors.length > 0) {
      this.doc.setFontSize(10);
      this.doc.text('Fatores de Risco Identificados:', this.margin, this.currentY);
      this.currentY += 5;
      
      data.riskAnalysis.factors.forEach((factor, index) => {
        this.doc.text(`• ${factor}`, this.margin + 5, this.currentY);
        this.currentY += 5;
      });
    }
    
    this.currentY += 5;
  }

  private addRecommendations(data: ReportData): void {
    if (!data.recommendations || data.recommendations.length === 0) return;
    
    this.checkPageBreak(80);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Recomendações Estratégicas', this.margin, this.currentY);
    this.currentY += 10;
    
    data.recommendations.forEach((rec, index) => {
      this.checkPageBreak(25);
      
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${index + 1}. ${rec.title}`, this.margin, this.currentY);
      this.currentY += 5;
      
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      
      // Quebrar texto longo em múltiplas linhas
      const lines = this.doc.splitTextToSize(rec.description, this.pageWidth - 2 * this.margin);
      this.doc.text(lines, this.margin + 5, this.currentY);
      this.currentY += lines.length * 4;
      
      // Informações adicionais
      this.doc.text(`Impacto: ${rec.impact.toUpperCase()} | Esforço: ${rec.effort.toUpperCase()}`, this.margin + 5, this.currentY);
      this.currentY += 8;
    });
  }

  private addFooter(data: ReportData): void {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Linha separadora
      this.doc.setDrawColor(200, 200, 200);
      this.doc.line(this.margin, this.pageHeight - 25, this.pageWidth - this.margin, this.pageHeight - 25);
      
      // Texto do rodapé
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('Relatório gerado pelo IntegraPricing - Sistema de Análise de Precificação', this.margin, this.pageHeight - 15);
      this.doc.text(`Página ${i} de ${pageCount}`, this.pageWidth - this.margin - 30, this.pageHeight - 15);
      this.doc.text(formatDate(data.generatedAt), this.pageWidth - this.margin - 80, this.pageHeight - 10);
    }
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 40) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }
}