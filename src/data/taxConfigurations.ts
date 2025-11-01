import { TaxConfiguration, Tax } from '@/types';

// Configurações tributárias por estado (dados atualizados para 2024)
export const brazilianTaxConfigurations: TaxConfiguration[] = [
  {
    state: 'SP',
    municipality: 'São Paulo',
    taxes: {
      ICMS: 18.0,
      PIS: 1.65,
      COFINS: 7.6,
      ISS: 5.0,
      IPI: 0.0, // Varia por produto
    },
    lastUpdated: new Date('2024-01-01'),
    source: 'Secretaria da Fazenda SP'
  },
  {
    state: 'RJ',
    municipality: 'Rio de Janeiro',
    taxes: {
      ICMS: 20.0,
      PIS: 1.65,
      COFINS: 7.6,
      ISS: 5.0,
    },
    lastUpdated: new Date('2024-01-01'),
    source: 'Secretaria da Fazenda RJ'
  },
  {
    state: 'MG',
    municipality: 'Belo Horizonte',
    taxes: {
      ICMS: 18.0,
      PIS: 1.65,
      COFINS: 7.6,
      ISS: 5.0,
    },
    lastUpdated: new Date('2024-01-01'),
    source: 'Secretaria da Fazenda MG'
  },
  {
    state: 'RS',
    municipality: 'Porto Alegre',
    taxes: {
      ICMS: 17.0,
      PIS: 1.65,
      COFINS: 7.6,
      ISS: 5.0,
    },
    lastUpdated: new Date('2024-01-01'),
    source: 'Secretaria da Fazenda RS'
  }
];

// Templates de impostos pré-configurados
export const defaultTaxTemplates: Tax[] = [
  {
    id: 'icms-sp',
    name: 'ICMS - São Paulo',
    percentage: 18.0,
    type: 'state',
    category: 'ICMS',
    isIncluded: true,
    calculationBase: 'gross',
    isActive: true,
    description: 'Imposto sobre Circulação de Mercadorias e Serviços',
    legalReference: 'Lei Complementar 87/1996'
  },
  {
    id: 'pis-federal',
    name: 'PIS',
    percentage: 1.65,
    type: 'federal',
    category: 'PIS',
    isIncluded: true,
    calculationBase: 'gross',
    isActive: true,
    description: 'Programa de Integração Social',
    legalReference: 'Lei Complementar 70/1991'
  },
  {
    id: 'cofins-federal',
    name: 'COFINS',
    percentage: 7.6,
    type: 'federal',
    category: 'COFINS',
    isIncluded: true,
    calculationBase: 'gross',
    isActive: true,
    description: 'Contribuição para o Financiamento da Seguridade Social',
    legalReference: 'Lei Complementar 70/1991'
  },
  {
    id: 'iss-municipal',
    name: 'ISS',
    percentage: 5.0,
    type: 'municipal',
    category: 'ISS',
    isIncluded: false,
    calculationBase: 'net',
    isActive: false,
    description: 'Imposto sobre Serviços de Qualquer Natureza',
    legalReference: 'Lei Complementar 116/2003'
  },
  {
    id: 'ipi-federal',
    name: 'IPI',
    percentage: 0.0,
    type: 'federal',
    category: 'IPI',
    isIncluded: false,
    calculationBase: 'gross',
    isActive: false,
    description: 'Imposto sobre Produtos Industrializados',
    legalReference: 'Decreto 7.212/2010'
  }
];

// Função para obter configuração tributária por localização
export function getTaxConfigurationByLocation(state: string, municipality?: string): TaxConfiguration | null {
  return brazilianTaxConfigurations.find(config => 
    config.state === state && 
    (!municipality || config.municipality === municipality)
  ) || null;
}

// Função para criar impostos baseados na localização
export function createTaxesFromLocation(state: string, municipality?: string): Tax[] {
  const config = getTaxConfigurationByLocation(state, municipality);
  if (!config) return defaultTaxTemplates;

  const taxes: Tax[] = [];
  
  // ICMS
  if (config.taxes.ICMS > 0) {
    taxes.push({
      id: `icms-${state.toLowerCase()}`,
      name: `ICMS - ${state}`,
      percentage: config.taxes.ICMS,
      type: 'state',
      category: 'ICMS',
      isIncluded: true,
      calculationBase: 'gross',
      isActive: true,
      description: 'Imposto sobre Circulação de Mercadorias e Serviços',
      legalReference: 'Lei Complementar 87/1996'
    });
  }

  // PIS
  taxes.push({
    id: 'pis-federal',
    name: 'PIS',
    percentage: config.taxes.PIS,
    type: 'federal',
    category: 'PIS',
    isIncluded: true,
    calculationBase: 'gross',
    isActive: true,
    description: 'Programa de Integração Social',
    legalReference: 'Lei Complementar 70/1991'
  });

  // COFINS
  taxes.push({
    id: 'cofins-federal',
    name: 'COFINS',
    percentage: config.taxes.COFINS,
    type: 'federal',
    category: 'COFINS',
    isIncluded: true,
    calculationBase: 'gross',
    isActive: true,
    description: 'Contribuição para o Financiamento da Seguridade Social',
    legalReference: 'Lei Complementary 70/1991'
  });

  // ISS (se aplicável)
  if (config.taxes.ISS && config.taxes.ISS > 0) {
    taxes.push({
      id: `iss-${municipality?.toLowerCase() || state.toLowerCase()}`,
      name: `ISS - ${municipality || state}`,
      percentage: config.taxes.ISS,
      type: 'municipal',
      category: 'ISS',
      isIncluded: false,
      calculationBase: 'net',
      isActive: false,
      description: 'Imposto sobre Serviços de Qualquer Natureza',
      legalReference: 'Lei Complementar 116/2003'
    });
  }

  // IPI (se aplicável)
  if (config.taxes.IPI && config.taxes.IPI > 0) {
    taxes.push({
      id: 'ipi-federal',
      name: 'IPI',
      percentage: config.taxes.IPI,
      type: 'federal',
      category: 'IPI',
      isIncluded: false,
      calculationBase: 'gross',
      isActive: false,
      description: 'Imposto sobre Produtos Industrializados',
      legalReference: 'Decreto 7.212/2010'
    });
  }

  return taxes;
}