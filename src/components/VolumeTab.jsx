import React from 'react';

const VolumeTab = ({ state, setters, results }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Volume de Vendas</h3>
        
        <div className="flex justify-between items-center mb-6">
          <label className="text-gray-700 font-medium">Volume Mensal Estimado (unidades):</label>
          <input
            type="number"
            value={state.volume}
            onChange={(e) => setters.setVolume(Math.max(1, parseFloat(e.target.value) || 0))}
            className="w-40 p-2 border rounded text-right text-lg font-bold"
            min="1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded border border-blue-100 text-center">
            <p className="text-sm text-gray-600 mb-1">Receita Mensal Estimada</p>
            <p className="text-2xl font-bold text-blue-700">R$ {results.monthlyRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded border border-green-100 text-center">
            <p className="text-sm text-gray-600 mb-1">Lucro Mensal Estimado</p>
            <p className="text-2xl font-bold text-green-700">R$ {results.monthlyProfit.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolumeTab;
