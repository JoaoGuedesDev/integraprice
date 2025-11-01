import * as XLSX from 'xlsx';
import { ReportData, ExportOptions, formatCurrency, formatPercentage, formatDate, generateExecutiveSummary, calculateReportMetrics } from './reportGenerator';

export class ExcelExporter {
  private workbook: XLSX.WorkBook;

  constructor() {
    this.workbook = XLSX.utils.book_new();
  }

  // Função principal para exportar relatório em Excel
  async exportReport(data: ReportData, options: ExportOptions): Promise<Blob> {
    try {
      // Aba principal com resumo
      this.addSummarySheet(data);
      
      // Aba de resultados financeiros
      this.addFinancialResultsSheet(data);
      
      // Aba de custos detalhados
      this.addCostBreakdownSheet(data);
      
      // Aba de análise tributária
      if (options.includeTaxBreakdown) {
        this.addTaxAnalysisSheet(data);
      }
      
      // Aba de análise de risco
      if (options.includeRiskAnalysis) {
        this.addRiskAnalysisSheet(data);
      }
      
      // Aba de recomendações
      if (options.includeRecommendations) {
        this.addRecommendationsSheet(data);
      }
      
      // Aba de dados brutos (para análises avançadas)
      if (options.template === 'detailed') {
        this.addRawDataSheet(data);
      }
      
      // Converter para blob
      const excelBuffer = XLSX.write(this.workbook, { 
        bookType: 'xlsx', 
        type: 'array',
        compression: true 
      });
      
      return new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
      throw new Error('Falha na geração do relatório Excel');
    }
  }

  private addSummarySheet(data: ReportData): void {
    const summary = generateExecutiveSummary(data);
    const metrics = calculateReportMetrics(data.results);
    
    const summaryData = [
      ['RELATÓRIO DE PRECIFICAÇÃO - INTEGRAPRICING'],
      [''],
      ['Produto:', data.productName],
      ['Data de Geração:', formatDate(data.generatedAt)],
      [''],
      ['RESUMO EXECUTIVO'],
      [''],
      ['Preço Final Recomendado:', data.results.finalPrice],
      ['Margem de Lucro:', data.results.actualMargin / 100],
      ['Ponto de Equilíbrio (unidades):', metrics.breakEvenUnits],
      ['Nível de Risco:', data.riskAnalysis?.level || 'N/A'],
      ['ROI Estimado:', metrics.roi / 100],
      [''],
      ['PRINCIPAIS MÉTRICAS'],
      [''],
      ['Custo Total por Unidade:', data.results.totalCostPerUnit],
      ['Receita Total Projetada:', data.results.totalRevenue],
      ['Lucro Total Projetado:', data.results.totalProfit],
      ['Carga Tributária:', data.results.effectiveTaxRate / 100],
      ['Margem Líquida:', data.results.netMargin / 100],
      [''],
      ['INFORMAÇÕES DO PRODUTO'],
      [''],
      ['Volume Esperado:', data.inputs.expectedVolume],
      ['Margem Desejada:', data.inputs.desiredMargin / 100],
      ['Número de Custos Fixos:', data.inputs.fixedCosts.length],
      ['Número de Custos Variáveis:', data.inputs.variableCosts.length],
      ['Número de Impostos:', data.inputs.taxes.length]
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Formatação
    this.formatSummarySheet(worksheet);
    
    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Resumo');
  }

  private addFinancialResultsSheet(data: ReportData): void {
    const metrics = calculateReportMetrics(data.results);
    
    const headers = ['Métrica', 'Valor', 'Formato'];
    const financialData = [
      ['Custo Fixo por Unidade', data.results.fixedCostPerUnit, formatCurrency(data.results.fixedCostPerUnit)],
      ['Custo Variável por Unidade', data.results.variableCostPerUnit, formatCurrency(data.results.variableCostPerUnit)],
      ['Custo Total por Unidade', data.results.totalCostPerUnit, formatCurrency(data.results.totalCostPerUnit)],
      ['Preço Mínimo', data.results.minimumPrice, formatCurrency(data.results.minimumPrice)],
      ['Preço Ideal', data.results.idealPrice, formatCurrency(data.results.idealPrice)],
      ['Preço Final', data.results.finalPrice, formatCurrency(data.results.finalPrice)],
      ['Margem Real (%)', data.results.actualMargin / 100, formatPercentage(data.results.actualMargin)],
      ['Margem Líquida (%)', data.results.netMargin / 100, formatPercentage(data.results.netMargin)],
      ['Ponto de Equilíbrio', metrics.breakEvenUnits, `${metrics.breakEvenUnits} unidades`],
      ['Receita Total', data.results.totalRevenue, formatCurrency(data.results.totalRevenue)],
      ['Custos Fixos Totais', data.results.totalFixedCosts, formatCurrency(data.results.totalFixedCosts)],
      ['Custos Variáveis Totais', data.results.totalVariableCosts, formatCurrency(data.results.totalVariableCosts)],
      ['Impostos Totais', data.results.totalTaxes, formatCurrency(data.results.totalTaxes)],
      ['Lucro Total', data.results.totalProfit, formatCurrency(data.results.totalProfit)],
      ['ROI (%)', metrics.roi / 100, formatPercentage(metrics.roi)]
    ];
    
    const sheetData = [headers, ...financialData];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    
    // Formatação de colunas
    worksheet['!cols'] = [
      { width: 25 },
      { width: 15 },
      { width: 20 }
    ];
    
    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Resultados Financeiros');
  }

  private addCostBreakdownSheet(data: ReportData): void {
    const sheetData: any[][] = [];
    
    // Custos Fixos
    sheetData.push(['CUSTOS FIXOS']);
    sheetData.push(['Nome', 'Categoria', 'Valor Total', 'Valor por Unidade']);
    
    data.inputs.fixedCosts.forEach(cost => {
      sheetData.push([
        cost.name,
        cost.category,
        cost.value,
        cost.value / data.inputs.expectedVolume
      ]);
    });
    
    const totalFixedCosts = data.inputs.fixedCosts.reduce((sum, cost) => sum + cost.value, 0);
    sheetData.push(['TOTAL CUSTOS FIXOS', '', totalFixedCosts, totalFixedCosts / data.inputs.expectedVolume]);
    
    sheetData.push(['']); // Linha vazia
    
    // Custos Variáveis
    sheetData.push(['CUSTOS VARIÁVEIS']);
    sheetData.push(['Nome', 'Categoria', 'Valor por Unidade', 'Valor Total']);
    
    data.inputs.variableCosts.forEach(cost => {
      sheetData.push([
        cost.name,
        cost.category,
        cost.valuePerUnit,
        cost.valuePerUnit * data.inputs.expectedVolume
      ]);
    });
    
    const totalVariableCosts = data.inputs.variableCosts.reduce((sum, cost) => sum + (cost.valuePerUnit * data.inputs.expectedVolume), 0);
    sheetData.push(['TOTAL CUSTOS VARIÁVEIS', '', '', totalVariableCosts]);
    
    sheetData.push(['']); // Linha vazia
    
    // Resumo
    sheetData.push(['RESUMO DE CUSTOS']);
    sheetData.push(['Tipo', 'Valor Total', 'Valor por Unidade', 'Percentual']);
    sheetData.push([
      'Custos Fixos',
      totalFixedCosts,
      totalFixedCosts / data.inputs.expectedVolume,
      (totalFixedCosts / (totalFixedCosts + totalVariableCosts))
    ]);
    sheetData.push([
      'Custos Variáveis',
      totalVariableCosts,
      totalVariableCosts / data.inputs.expectedVolume,
      (totalVariableCosts / (totalFixedCosts + totalVariableCosts))
    ]);
    sheetData.push([
      'TOTAL',
      totalFixedCosts + totalVariableCosts,
      (totalFixedCosts + totalVariableCosts) / data.inputs.expectedVolume,
      1
    ]);
    
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    
    // Formatação
    worksheet['!cols'] = [
      { width: 25 },
      { width: 15 },
      { width: 18 },
      { width: 18 }
    ];
    
    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Detalhamento de Custos');
  }

  private addTaxAnalysisSheet(data: ReportData): void {
    if (!data.results.taxCalculations || data.results.taxCalculations.length === 0) return;
    
    const headers = ['Imposto', 'Categoria', 'Alíquota (%)', 'Base de Cálculo', 'Valor do Imposto', 'Tipo', 'Ativo'];
    const taxData = data.results.taxCalculations.map(tax => [
      tax.name,
      tax.category,
      tax.percentage / 100,
      tax.calculationBase,
      tax.taxAmount,
      tax.isIncluded ? 'Incluso' : 'Excluso',
      'Sim'
    ]);
    
    const sheetData = [headers, ...taxData];
    
    // Adicionar resumo
    sheetData.push(['']); // Linha vazia
    sheetData.push(['RESUMO TRIBUTÁRIO']);
    sheetData.push(['Métrica', 'Valor']);
    sheetData.push(['Total Impostos Inclusos', data.results.totalIncludedTaxes]);
    sheetData.push(['Total Impostos Exclusos', data.results.totalExcludedTaxes]);
    sheetData.push(['Total Geral de Impostos', data.results.totalTaxes]);
    sheetData.push(['Carga Tributária Efetiva (%)', data.results.effectiveTaxRate / 100]);
    sheetData.push(['Preço sem Impostos', data.results.priceWithoutTaxes]);
    sheetData.push(['Preço com Impostos Inclusos', data.results.priceWithIncludedTaxes]);
    
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    
    // Formatação
    worksheet['!cols'] = [
      { width: 20 },
      { width: 15 },
      { width: 12 },
      { width: 18 },
      { width: 18 },
      { width: 10 },
      { width: 8 }
    ];
    
    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Análise Tributária');
  }

  private addRiskAnalysisSheet(data: ReportData): void {
    if (!data.riskAnalysis) {
      // Se não há análise de risco, criar uma planilha vazia
      const sheetData = [
        ['ANÁLISE DE RISCO'],
        [''],
        ['Análise de risco não disponível para este produto.']
      ];
      
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Análise de Risco');
      return;
    }

    const sheetData = [
      ['ANÁLISE DE RISCO'],
      [''],
      ['Nível de Risco:', data.riskAnalysis.level],
      ['Score de Risco:', data.riskAnalysis.score],
      [''],
      ['FATORES DE RISCO IDENTIFICADOS']
    ];
    
    if (data.riskAnalysis.factors && data.riskAnalysis.factors.length > 0) {
      sheetData.push(['Fator', 'Descrição']);
      data.riskAnalysis.factors.forEach((factor, index) => {
        sheetData.push([`Fator ${index + 1}`, factor]);
      });
    }
    
    sheetData.push(['']);
    sheetData.push(['RECOMENDAÇÕES DE MITIGAÇÃO']);
    
    if (data.riskAnalysis.recommendations && data.riskAnalysis.recommendations.length > 0) {
      sheetData.push(['Recomendação', 'Descrição']);
      data.riskAnalysis.recommendations.forEach((rec, index) => {
        sheetData.push([`Recomendação ${index + 1}`, rec]);
      });
    }
    
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    
    // Formatação
    worksheet['!cols'] = [
      { width: 20 },
      { width: 60 }
    ];
    
    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Análise de Risco');
  }

  private addRecommendationsSheet(data: ReportData): void {
    if (!data.recommendations || data.recommendations.length === 0) return;
    
    const headers = ['#', 'Título', 'Tipo', 'Descrição', 'Impacto', 'Esforço', 'Prioridade'];
    const recData = data.recommendations.map((rec, index) => [
      index + 1,
      rec.title,
      rec.type,
      rec.description,
      rec.impact,
      rec.effort,
      rec.priority
    ]);
    
    const sheetData = [headers, ...recData];
    
    // Adicionar seção de itens de ação
    sheetData.push(['']);
    sheetData.push(['ITENS DE AÇÃO DETALHADOS']);
    sheetData.push(['Recomendação', 'Ação', 'Descrição']);
    
    data.recommendations.forEach((rec, recIndex) => {
      if (rec.actionItems && rec.actionItems.length > 0) {
        rec.actionItems.forEach((action, actionIndex) => {
          sheetData.push([
            `${recIndex + 1}. ${rec.title}`,
            `Ação ${actionIndex + 1}`,
            action
          ]);
        });
      }
    });
    
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    
    // Formatação
    worksheet['!cols'] = [
      { width: 5 },
      { width: 25 },
      { width: 15 },
      { width: 40 },
      { width: 10 },
      { width: 10 },
      { width: 10 }
    ];
    
    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Recomendações');
  }

  private addRawDataSheet(data: ReportData): void {
    const sheetData = [
      ['DADOS BRUTOS PARA ANÁLISE'],
      [''],
      ['Gerado em:', formatDate(data.generatedAt)],
      ['Produto:', data.productName],
      [''],
      ['INPUTS ORIGINAIS'],
      [''],
      ['Volume Esperado:', data.inputs.expectedVolume],
      ['Margem Desejada (%):', data.inputs.desiredMargin],
      [''],
      ['CUSTOS FIXOS (JSON)'],
      [JSON.stringify(data.inputs.fixedCosts, null, 2)],
      [''],
      ['CUSTOS VARIÁVEIS (JSON)'],
      [JSON.stringify(data.inputs.variableCosts, null, 2)],
      [''],
      ['IMPOSTOS (JSON)'],
      [JSON.stringify(data.inputs.taxes, null, 2)],
      [''],
      ['RESULTADOS COMPLETOS (JSON)'],
      [JSON.stringify(data.results, null, 2)],
      [''],
      ['ANÁLISE DE RISCO (JSON)'],
      [JSON.stringify(data.riskAnalysis, null, 2)],
      [''],
      ['RECOMENDAÇÕES (JSON)'],
      [JSON.stringify(data.recommendations, null, 2)]
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    
    // Formatação para dados JSON
    worksheet['!cols'] = [
      { width: 100 }
    ];
    
    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Dados Brutos');
  }

  private formatSummarySheet(worksheet: XLSX.WorkSheet): void {
    // Definir larguras das colunas
    worksheet['!cols'] = [
      { width: 30 },
      { width: 20 }
    ];
    
    // Aplicar formatação de células (isso seria mais complexo em uma implementação real)
    // Por simplicidade, mantemos a formatação básica
  }
}