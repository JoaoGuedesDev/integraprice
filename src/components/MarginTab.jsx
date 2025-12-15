import React from 'react';

const MarginTab = ({ state, actions, setters, results, openSettings }) => {
  return (
    <div className="space-y-6">
      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Margem Desejada (%)</label>
          <input
            type="number"
            value={state.desiredMargin}
            onChange={(e) => setters.setDesiredMargin(parseFloat(e.target.value) || 0)}
            className="p-2 border rounded text-right focus:ring-2 focus:ring-blue-300 outline-none"
            min="0"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Comissão de Vendas (%)</label>
          <input
            type="number"
            value={state.commission}
            onChange={(e) => setters.setCommission(parseFloat(e.target.value) || 0)}
            className="p-2 border rounded text-right focus:ring-2 focus:ring-blue-300 outline-none"
            min="0"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Desconto (%)</label>
          <input
            type="number"
            value={state.discount}
            onChange={(e) => setters.setDiscount(parseFloat(e.target.value) || 0)}
            className="p-2 border rounded text-right focus:ring-2 focus:ring-blue-300 outline-none"
            min="0"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4"></div>

      {/* Taxes Read-Only Section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Impostos (Config):</span>
                <button onClick={openSettings} className="text-blue-600 hover:underline text-xs">(Editar)</button>
            </div>
            <span className="font-bold text-gray-900">{results.totalTaxesPercent.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Taxas Venda (Cartão/Mkt):</span>
                <button onClick={openSettings} className="text-blue-600 hover:underline text-xs">(Editar)</button>
            </div>
            <span className="font-bold text-gray-900">{results.totalSalesFeesPercent ? results.totalSalesFeesPercent.toFixed(2) : '0.00'}%</span>
        </div>
      </div>
    </div>
  );
};

export default MarginTab;
