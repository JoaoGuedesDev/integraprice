import { useState, useMemo } from 'react';

export const useCalculator = () => {
  // State for Product Info (Header)
  const [productInfo, setProductInfo] = useState({
    name: '',
    sku: ''
  });

  // State for Company Info (Dados Gerais)
  const [companyInfo, setCompanyInfo] = useState({
    legalName: '',
    tradeName: '',
    cnpj: '',
    email: '',
    phone: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  // Saved Products State
  const [savedProducts, setSavedProducts] = useState([]);

  // State for Costs (Aba 1)
  const [fixedCosts, setFixedCosts] = useState([
    { id: 1, name: 'Aluguel', value: 0 },
    { id: 2, name: 'Salários', value: 0 },
  ]);
  const [variableCosts, setVariableCosts] = useState([
    { id: 1, name: 'Matéria-prima', value: 0 },
    { id: 2, name: 'Embalagem', value: 0 },
  ]);
  const [otherCosts, setOtherCosts] = useState(0);

  // State for Margin & Taxes (Aba 2)
  const [desiredMargin, setDesiredMargin] = useState(20); // %
  const [taxes, setTaxes] = useState([
    { id: 1, name: 'Simples Nacional', value: 0 },
  ]);
  const [salesFees, setSalesFees] = useState([
    { id: 1, name: 'Taxa Cartão Crédito', value: 0 },
    { id: 2, name: 'Taxa Marketplace', value: 0 },
  ]);
  const [commission, setCommission] = useState(0); // %
  const [discount, setDiscount] = useState(0); // %

  // State for Volume (Aba 3)
  const [volume, setVolume] = useState(100);

  // Helper to sum arrays
  const sumValues = (items) => items.reduce((acc, item) => acc + (parseFloat(item.value) || 0), 0);

  // Calculations
  const results = useMemo(() => {
    // 1. Total Custos Fixos
    const totalFixedCosts = sumValues(fixedCosts);

    // 2. Total Custos Variáveis (unitário)
    const totalVariableCostsUnit = sumValues(variableCosts);

    // 3. Total Impostos (%)
    const totalTaxesPercent = sumValues(taxes);
    
    // 3.1 Total Taxas de Venda (%)
    const totalSalesFeesPercent = sumValues(salesFees);

    // Ensure volume is at least 1 to avoid division by zero
    const safeVolume = Math.max(1, parseFloat(volume) || 1);

    // 4. Custo Total
    // Formula: totalCustosFixos + (totalCustosVariaveis * volumeMensal) + outrosCustos
    // Note: totalVariableCostsUnit is per unit, so we multiply by volume.
    // However, the user prompt says "Lista dinâmica de Custos Variáveis por unidade".
    // Formula says: totalCustosVariaveis * volumeMensal.
    // So totalVariableCostsUnit is indeed "totalCustosVariaveis" in the formula context (sum of unit variable costs).
    const totalCost = totalFixedCosts + (totalVariableCostsUnit * safeVolume) + (parseFloat(otherCosts) || 0);

    // 5. Custo Unitário
    const unitCost = totalCost / safeVolume;

    // Decimal conversions
    const marginDecimal = (parseFloat(desiredMargin) || 0) / 100;
    const taxesDecimal = totalTaxesPercent / 100;
    const salesFeesDecimal = totalSalesFeesPercent / 100;
    const commissionDecimal = (parseFloat(commission) || 0) / 100;
    const discountDecimal = (parseFloat(discount) || 0) / 100;

    // 10. Preço Base
    // Denominator check
    const denominator = 1 - marginDecimal - taxesDecimal - salesFeesDecimal - commissionDecimal;
    let basePrice = 0;
    if (denominator > 0) {
      basePrice = unitCost / denominator;
    } else {
      // Handle impossible margin/tax combination
      basePrice = 0; // Or Infinity, handled in UI
    }

    // 11. Preço Final
    const finalPrice = basePrice * (1 - discountDecimal);

    // 12. Lucro Unitário
    // Formula: precoFinal - custoUnitario - (precoFinal * impostosDecimal) - (precoFinal * comissaoDecimal)
    // Note: The formula subtracts taxes and commission from the final price.
    // Usually taxes apply to the invoice price (finalPrice).
    const unitProfit = finalPrice - unitCost - (finalPrice * taxesDecimal) - (finalPrice * salesFeesDecimal) - (finalPrice * commissionDecimal);

    // 13. Margem Real (%)
    // Formula: (lucroUnitario / precoFinal) * 100
    let realMargin = 0;
    if (finalPrice > 0) {
      realMargin = (unitProfit / finalPrice) * 100;
    }

    // 14. Receita Mensal
    const monthlyRevenue = finalPrice * safeVolume;

    // 15. Lucro Mensal
    const monthlyProfit = unitProfit * safeVolume;

    return {
      totalFixedCosts,
      totalVariableCostsUnit,
      totalTaxesPercent,
      totalSalesFeesPercent,
      totalCost,
      unitCost,
      basePrice,
      finalPrice,
      unitProfit,
      realMargin,
      monthlyRevenue,
      monthlyProfit,
      isValid: denominator > 0
    };
  }, [fixedCosts, variableCosts, otherCosts, desiredMargin, taxes, salesFees, commission, discount, volume]);

  // Actions
  const addFixedCost = (name = '') => setFixedCosts([...fixedCosts, { id: Date.now(), name, value: 0 }]);
  const removeFixedCost = (id) => setFixedCosts(fixedCosts.filter(c => c.id !== id));
  const updateFixedCost = (id, field, val) => {
    setFixedCosts(fixedCosts.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const addVariableCost = (name = '') => setVariableCosts([...variableCosts, { id: Date.now(), name, value: 0 }]);
  const removeVariableCost = (id) => setVariableCosts(variableCosts.filter(c => c.id !== id));
  const updateVariableCost = (id, field, val) => {
    setVariableCosts(variableCosts.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const addTax = () => setTaxes([...taxes, { id: Date.now(), name: '', value: 0 }]);
  const removeTax = (id) => setTaxes(taxes.filter(t => t.id !== id));
  const updateTax = (id, field, val) => {
    setTaxes(taxes.map(t => t.id === id ? { ...t, [field]: val } : t));
  };

  const addSalesFee = () => setSalesFees([...salesFees, { id: Date.now(), name: '', value: 0 }]);
  const removeSalesFee = (id) => setSalesFees(salesFees.filter(f => f.id !== id));
  const updateSalesFee = (id, field, val) => {
    setSalesFees(salesFees.map(f => f.id === id ? { ...f, [field]: val } : f));
  };

  const updateProductInfo = (field, val) => {
    setProductInfo(prev => ({ ...prev, [field]: val }));
  };

  const updateCompanyInfo = (field, val, isAddress = false) => {
    if (isAddress) {
      setCompanyInfo(prev => ({
        ...prev,
        address: { ...prev.address, [field]: val }
      }));
    } else {
      setCompanyInfo(prev => ({ ...prev, [field]: val }));
    }
  };

  const saveProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: productInfo.name || 'Produto Sem Nome',
      sku: productInfo.sku,
      variableCosts: [...variableCosts],
      volume: volume,
      unitCost: results.unitCost,
      finalPrice: results.finalPrice,
      commission: commission,
      taxes: [...taxes],
      salesFees: [...salesFees],
      // Snapshot of global settings at time of save, or we could reference current global
      // but DRE usually wants point-in-time or current. 
      // User request implies "Simule o DRE... com base nos produtos selecionados", so we'll store everything needed for the DRE calc.
    };
    setSavedProducts(prev => [...prev, newProduct]);
  };

  const deleteSavedProduct = (id) => {
    setSavedProducts(prev => prev.filter(p => p.id !== id));
  };

  return {
    state: {
      productInfo,
      companyInfo,
      savedProducts,
      fixedCosts,
      variableCosts,
      otherCosts,
      desiredMargin,
      taxes,
      salesFees,
      commission,
      discount,
      volume
    },
    setters: {
      setOtherCosts,
      setDesiredMargin,
      setCommission,
      setDiscount,
      setVolume
    },
    actions: {
      addFixedCost,
      removeFixedCost,
      updateFixedCost,
      addVariableCost,
      removeVariableCost,
      updateVariableCost,
      addTax,
      removeTax,
      updateTax,
      addSalesFee,
      removeSalesFee,
      updateSalesFee,
      updateProductInfo,
      updateCompanyInfo,
      saveProduct,
      deleteSavedProduct
    },
    results
  };
};
