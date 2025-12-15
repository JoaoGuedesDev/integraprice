import React, { useState, useMemo } from 'react';

const ReportsTab = ({ state, actions }) => {
  const { 
    savedProducts, 
    fixedCosts, 
    taxes, 
    salesFees 
  } = state;

  // Local state for simulation (which products are selected and their quantities)
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});

  // Helper to toggle selection
  const toggleSelection = (id) => {
    setSelectedProductIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(pid => pid !== id);
      } else {
        return [...prev, id];
      }
    });
    // Initialize quantity if not set
    if (!quantities[id]) {
      setQuantities(prev => ({ ...prev, [id]: 1 }));
    }
  };

  // Helper to update quantity
  const updateQuantity = (id, val) => {
    const qty = Math.max(0, parseInt(val) || 0);
    setQuantities(prev => ({ ...prev, [id]: qty }));
  };

  // --- Aggregated Calculations ---
  const aggregatedResults = useMemo(() => {
    let totalRevenue = 0;
    let totalVariableCosts = 0;
    let totalCommissions = 0;
    let totalTaxesValue = 0;
    let totalSalesFeesValue = 0;
    let variableCostBreakdown = []; // Collect all var costs from all products

    // Iterate over selected products
    selectedProductIds.forEach(id => {
      const product = savedProducts.find(p => p.id === id);
      if (!product) return;

      const qty = quantities[id] || 0;
      if (qty <= 0) return;

      // Product Revenue
      const pRevenue = product.finalPrice * qty;
      totalRevenue += pRevenue;

      // Product Variable Costs (Unit Cost * Qty)
      // Note: product.unitCost includes raw materials + packaging etc.
      // We can also break it down if we stored variableCosts array in savedProduct.
      // Let's assume unitCost is the sum of variable costs.
      // For breakdown in DRE, we might want to aggregate by name, but for now simple sum.
      // Actually, savedProduct has variableCosts array.
      if (product.variableCosts) {
         product.variableCosts.forEach(vc => {
           const vcTotal = (parseFloat(vc.value) || 0) * qty;
           totalVariableCosts += vcTotal;
           
           // Add to breakdown
           const existing = variableCostBreakdown.find(item => item.name === vc.name);
           if (existing) {
             existing.value += vcTotal;
           } else {
             variableCostBreakdown.push({ name: vc.name, value: vcTotal });
           }
         });
      } else {
         // Fallback if detail missing
         totalVariableCosts += (product.unitCost * qty);
      }

      // Product Commission
      const pCommission = (pRevenue * (parseFloat(product.commission) || 0)) / 100;
      totalCommissions += pCommission;

      // Product Taxes
      // Sum of tax percents for this product
      const pTotalTaxPercent = product.taxes ? product.taxes.reduce((acc, t) => acc + (parseFloat(t.value)||0), 0) : 0;
      const pTaxesValue = (pRevenue * pTotalTaxPercent) / 100;
      totalTaxesValue += pTaxesValue;

      // Product Sales Fees
      const pTotalSalesFeePercent = product.salesFees ? product.salesFees.reduce((acc, f) => acc + (parseFloat(f.value)||0), 0) : 0;
      const pSalesFeesValue = (pRevenue * pTotalSalesFeePercent) / 100;
      totalSalesFeesValue += pSalesFeesValue;
    });

    const totalSellingCosts = totalCommissions + totalTaxesValue + totalSalesFeesValue;
    const totalCosts = totalVariableCosts + totalSellingCosts;
    const grossProfit = totalRevenue - totalCosts;

    // Fixed Costs are Global (Company wide)
    const totalFixedCostsValue = fixedCosts.reduce((acc, fc) => acc + (parseFloat(fc.value)||0), 0);

    const netProfit = grossProfit - totalFixedCostsValue;

    return {
      totalRevenue,
      totalVariableCosts,
      variableCostBreakdown,
      totalCommissions,
      totalTaxesValue,
      totalSalesFeesValue,
      totalSellingCosts,
      totalCosts,
      grossProfit,
      totalFixedCostsValue,
      netProfit,
      isProfit: netProfit >= 0
    };
  }, [selectedProductIds, quantities, savedProducts, fixedCosts]);

  // Format helpers
  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatPercent = (value, total) => {
    if (!total || total === 0) return '0,00%';
    return ((value / total) * 100).toFixed(2).replace('.', ',') + '%';
  };
  const sumValues = (items) => items.reduce((acc, item) => acc + (parseFloat(item.value) || 0), 0);

  // Render Helper for DRE Rows
  const DRERow = ({ label, value, totalForPercent, isHeader = false, isSubHeader = false, isTotal = false, colorClass = '', indent = false }) => {
    // If revenue is 0, percent is 0
    const percentStr = aggregatedResults.totalRevenue > 0 ? formatPercent(value, aggregatedResults.totalRevenue) : '0,00%';
    
    let baseClasses = "flex justify-between items-center py-2 px-4 border-b border-gray-800";
    if (isHeader) baseClasses += " bg-gray-800 font-bold text-lg";
    else if (isSubHeader) baseClasses += " bg-gray-900/50 font-semibold";
    else if (isTotal) baseClasses += " font-bold text-lg mt-2";
    else baseClasses += " text-gray-300 text-sm hover:bg-gray-800/30";

    if (indent) baseClasses += " pl-8";

    return (
      <div className={baseClasses}>
        <span className={colorClass}>{label}</span>
        <div className="flex items-center gap-4">
          <span className={colorClass}>{formatCurrency(value)}</span>
          <span className={`${colorClass} opacity-75 w-16 text-right`}>{percentStr}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Panel: Product Selection */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden flex-1">
          <div className="bg-gray-800 p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-orange-500 flex items-center gap-2">
              📋 Geração de DRE
            </h2>
            <p className="text-gray-400 text-xs mt-1">Selecione os produtos e informe as quantidades para simular o DRE.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-800 text-gray-400 uppercase font-medium">
                <tr>
                  <th className="p-3 w-10"></th>
                  <th className="p-3 w-20">Qtd</th>
                  <th className="p-3">Produto</th>
                  <th className="p-3 text-right">Custo (un)</th>
                  <th className="p-3 text-right">Venda (un)</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {savedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500 italic">
                      Nenhum produto salvo. Salve produtos na calculadora para simular.
                    </td>
                  </tr>
                ) : (
                  savedProducts.map(product => {
                    const isSelected = selectedProductIds.includes(product.id);
                    return (
                      <tr key={product.id} className={`hover:bg-gray-800/50 transition-colors ${isSelected ? 'bg-gray-800/30' : ''}`}>
                        <td className="p-3">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => toggleSelection(product.id)}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500 cursor-pointer"
                          />
                        </td>
                        <td className="p-3">
                          <input 
                            type="number" 
                            min="0"
                            value={quantities[product.id] || 0}
                            onChange={(e) => updateQuantity(product.id, e.target.value)}
                            disabled={!isSelected}
                            className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-center focus:ring-1 focus:ring-orange-500 outline-none disabled:opacity-50"
                          />
                        </td>
                        <td className="p-3 font-medium text-white">{product.name}</td>
                        <td className="p-3 text-right text-gray-400">{formatCurrency(product.unitCost)}</td>
                        <td className="p-3 text-right text-white font-semibold">{formatCurrency(product.finalPrice)}</td>
                        <td className="p-3">
                          <button 
                             onClick={() => actions.deleteSavedProduct(product.id)}
                             className="text-gray-500 hover:text-red-500 transition-colors"
                             title="Excluir produto"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Panel: Config Summary & DRE */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Config Summary */}
        <div className="bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden p-4">
           <h3 className="text-orange-500 font-bold mb-3 flex items-center gap-2">
             ⚙️ Configurações do DRE (Globais)
           </h3>
           <div className="grid grid-cols-2 gap-4 text-sm">
             <div className="bg-gray-800 p-3 rounded border border-gray-700">
               <span className="text-gray-400 block text-xs uppercase mb-1">Custos Fixos Totais</span>
               <span className="text-white font-bold text-lg">{formatCurrency(sumValues(fixedCosts))}</span>
             </div>
             <div className="bg-gray-800 p-3 rounded border border-gray-700">
               <span className="text-gray-400 block text-xs uppercase mb-1">Impostos (Média Config)</span>
               <span className="text-white font-bold text-lg">{sumValues(taxes).toFixed(2).replace('.', ',')}%</span>
             </div>
             <div className="bg-gray-800 p-3 rounded border border-gray-700">
               <span className="text-gray-400 block text-xs uppercase mb-1">Taxas de Cartão (Média Config)</span>
               <span className="text-white font-bold text-lg">{sumValues(salesFees).toFixed(2).replace('.', ',')}%</span>
             </div>
             <div className="bg-gray-800 p-3 rounded border border-gray-700">
               <span className="text-gray-400 block text-xs uppercase mb-1">Investimento (Placeholder)</span>
               <span className="text-white font-bold text-lg">0,00%</span>
             </div>
           </div>
        </div>

        {/* DRE Table */}
        <div className="bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden flex-1">
          <div className="bg-gray-800 p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-orange-500 flex items-center gap-2">
              📄 Demonstrativo (DRE)
            </h2>
          </div>

          <div className="p-0">
            {/* (+) Receita Total */}
            <DRERow 
              label="(+) Receita total" 
              value={aggregatedResults.totalRevenue} 
              isHeader 
              colorClass="text-green-500" 
            />
            <DRERow 
              label="Vendas" 
              value={aggregatedResults.totalRevenue} 
              indent 
              colorClass="text-gray-300" 
            />

            {/* (-) Custo Total */}
            <DRERow 
              label="(-) Custo total" 
              value={aggregatedResults.totalCosts} 
              isHeader 
              colorClass="text-red-500" 
            />

            {/* (-) Custo sobre a compra */}
            <DRERow 
              label="(-) Custo sobre a compra" 
              value={aggregatedResults.totalVariableCosts} 
              isSubHeader 
              colorClass="text-red-400" 
            />
            {aggregatedResults.variableCostBreakdown.map((item, idx) => (
              <DRERow 
                key={`vc-${idx}`}
                label={item.name} 
                value={item.value} 
                indent 
                colorClass="text-gray-300" 
              />
            ))}
             {aggregatedResults.variableCostBreakdown.length === 0 && (
              <DRERow label="-" value={0} indent colorClass="text-gray-500" />
            )}

            {/* (-) Custo sobre a venda */}
            <DRERow 
              label="(-) Custo sobre a venda" 
              value={aggregatedResults.totalSellingCosts} 
              isSubHeader 
              colorClass="text-red-400" 
            />
            <DRERow label="Comissões sobre venda" value={aggregatedResults.totalCommissions} indent colorClass="text-gray-300" />
            <DRERow label="Impostos" value={aggregatedResults.totalTaxesValue} indent colorClass="text-gray-300" />
            <DRERow label="Taxas de cartão" value={aggregatedResults.totalSalesFeesValue} indent colorClass="text-gray-300" />

            {/* (=) Lucro Bruto */}
            <DRERow 
              label="(=) Lucro bruto" 
              value={aggregatedResults.grossProfit} 
              isHeader 
              colorClass="text-green-500" 
            />

            {/* (-) Despesas Fixas */}
            <DRERow 
              label="(-) Despesas fixas" 
              value={aggregatedResults.totalFixedCostsValue} 
              isHeader 
              colorClass="text-red-500" 
            />
            <DRERow label="Despesas operacionais" value={aggregatedResults.totalFixedCostsValue} indent colorClass="text-gray-300" />

            {/* (=) Resultado Líquido */}
            <div className={`flex justify-between items-center py-4 px-4 bg-gray-800 border-t-2 ${aggregatedResults.isProfit ? 'border-green-600' : 'border-red-600'} mt-4`}>
              <span className={`text-xl font-bold ${aggregatedResults.isProfit ? 'text-green-500' : 'text-red-500'}`}>
                {aggregatedResults.isProfit ? '(=) Lucro líquido' : '(=) Prejuízo líquido'}
              </span>
              <div className="flex items-center gap-4">
                <span className={`text-xl font-bold ${aggregatedResults.isProfit ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(aggregatedResults.netProfit)}
                </span>
                <span className={`text-lg font-bold opacity-75 w-20 text-right ${aggregatedResults.isProfit ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercent(aggregatedResults.netProfit, aggregatedResults.totalRevenue)}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
