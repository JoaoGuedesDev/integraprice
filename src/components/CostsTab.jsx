import React from 'react';
import CostInputWithSuggestions from './CostInputWithSuggestions';

const VARIABLE_COST_EXAMPLES = [
  'Matéria-prima',
  'Embalagem',
  'Etiquetas',
  'Frete (Entrega)',
  'Taxa de Cartão (Antecipação)',
  'Brindes',
  'Mão de obra terceirizada',
  'Combustível',
  'Comissão extra'
];

const CostsTab = ({ state, actions, setters, results, openSettings }) => {
  return (
    <div className="space-y-8">
      
      {/* 1. Custos Variáveis (Main Focus) */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">1. Composição do Produto (Custos Variáveis)</h3>
            <p className="text-sm text-gray-500">Liste todos os custos diretos para produzir/vender 1 unidade.</p>
          </div>
          <button 
            onClick={() => actions.addVariableCost()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
          >
            + Adicionar Item
          </button>
        </div>
        <div className="space-y-3">
          {state.variableCosts.map((cost) => (
            <div key={cost.id} className="flex gap-3 items-center bg-gray-50 p-2 rounded border border-gray-100">
              <div className="flex-1">
                <CostInputWithSuggestions
                  placeholder="Item (ex: Embalagem)"
                  value={cost.name}
                  onChange={(e) => actions.updateVariableCost(cost.id, 'name', e.target.value)}
                  suggestions={VARIABLE_COST_EXAMPLES}
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  placeholder="0,00"
                  value={cost.value}
                  onChange={(e) => actions.updateVariableCost(cost.id, 'value', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded text-sm text-right focus:ring-2 focus:ring-blue-300 outline-none"
                  min="0"
                />
              </div>
              <button 
                onClick={() => actions.removeVariableCost(cost.id)}
                className="text-gray-400 hover:text-red-500 p-2 rounded hover:bg-red-50 transition-colors"
                title="Remover custo"
              >
                🗑️
              </button>
            </div>
          ))}
          {state.variableCosts.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">Nenhum custo variável cadastrado.</p>
              <p className="text-gray-400 text-xs mt-1">Adicione materiais, insumos ou taxas por venda.</p>
            </div>
          )}
        </div>
        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total por Unidade:</span>
          <span className="text-lg font-bold text-gray-800">R$ {results.totalVariableCostsUnit.toFixed(2)}</span>
        </div>
      </div>

      {/* 2. Outros Custos e Resumo Geral */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-4">
          <label className="font-bold text-gray-800">Outros Custos Específicos:</label>
          <input
            type="number"
            value={state.otherCosts}
            onChange={(e) => setters.setOtherCosts(parseFloat(e.target.value) || 0)}
            className="w-full md:w-48 p-2 border rounded text-right font-medium focus:ring-2 focus:ring-blue-300 outline-none"
            min="0"
          />
        </div>
        
        {/* Read-only Fixed Costs Summary */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm text-gray-600 mt-4 border border-gray-200">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-2">
                <span>Custos Fixos da Empresa:</span>
                <button onClick={openSettings} className="text-blue-600 hover:underline text-xs">(Editar Configurações)</button>
             </div>
             <span className="font-medium">R$ {results.totalFixedCosts.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center border-t border-gray-200 pt-2">
            <span>Custo Total Mensal (Fixos + Var x Vol + Outros):</span>
            <span className="font-bold text-gray-800">R$ {results.totalCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-1 text-base">
            <span>Custo Unitário Final (Rateado pelo Volume):</span>
            <span className="font-bold text-xl text-blue-700">R$ {results.unitCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostsTab;
