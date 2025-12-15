import React from 'react';

const ResultPanel = ({ results, desiredMargin }) => {
  const isMarginLow = results.realMargin < desiredMargin;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl space-y-6">
      <h2 className="text-xl font-bold border-b border-gray-700 pb-2">Resultado da Precificação</h2>

      <div className="grid grid-cols-2 gap-y-4 gap-x-8">
        <div>
          <p className="text-gray-400 text-sm">Preço Sugerido (Venda)</p>
          <p className="text-3xl font-bold text-yellow-400">R$ {results.finalPrice.toFixed(2)}</p>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm">Lucro Unitário</p>
          <p className="text-xl font-semibold text-green-400">R$ {results.unitProfit.toFixed(2)}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Custo Unitário</p>
          <p className="text-lg text-white">R$ {results.unitCost.toFixed(2)}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Margem Real / Planejada</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-bold ${isMarginLow ? 'text-red-400' : 'text-green-400'}`}>
              {results.realMargin.toFixed(2)}%
            </span>
            <span className="text-gray-500 text-sm">/ {desiredMargin}%</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-sm">Receita Mensal</p>
          <p className="text-lg font-semibold">R$ {results.monthlyRevenue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Lucro Mensal</p>
          <p className="text-lg font-semibold text-green-400">R$ {results.monthlyProfit.toFixed(2)}</p>
        </div>
      </div>

      {isMarginLow && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-sm text-center font-medium animate-pulse">
          ⚠️ Atenção: A margem real está abaixo da planejada!
        </div>
      )}
      
      {!results.isValid && (
        <div className="bg-red-600 text-white p-3 rounded text-sm text-center font-bold">
          Erro: A soma das margens e impostos ultrapassa 100% ou é inválida.
        </div>
      )}
    </div>
  );
};

export default ResultPanel;
