import React from 'react';
import CostInputWithSuggestions from './CostInputWithSuggestions';
import AddButtonWithDropdown from './AddButtonWithDropdown';

const FIXED_COST_EXAMPLES = [
  'Aluguel',
  'Condomínio',
  'IPTU',
  'Energia Elétrica',
  'Água/Esgoto',
  'Internet/Telefone',
  'Salários',
  'Pro-labore',
  'Contabilidade',
  'Software/Sistemas',
  'Material de Limpeza',
  'Manutenção Predial',
  'Marketing Fixo',
  'Seguros'
];

const SettingsModal = ({ isOpen, onClose, state, actions, results, isScreen = false }) => {
  if (!isOpen && !isScreen) return null;

  const contentClass = isScreen 
    ? "h-full flex flex-col bg-gray-50"
    : "fixed inset-0 z-50 bg-white flex flex-col";

  return (
    <div className={contentClass}>
      {/* Header - Only show if Modal, or maybe show title if Screen? */}
      <div className="bg-gray-900 px-6 py-4 flex justify-between items-center shadow-md">
        <div>
          <h2 className="text-xl font-bold text-white">Configurações da Empresa</h2>
          <p className="text-gray-400 text-sm">Defina custos fixos e impostos padrão.</p>
        </div>
        {!isScreen && (
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl p-2">
            &times; Fechar
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
        
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* 1. Custos Fixos */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-blue-500 pb-1 inline-block">
                1. Custos Fixos Mensais
              </h3>
              <AddButtonWithDropdown 
                label="Adicionar Custo" 
                onSelect={actions.addFixedCost}
                suggestions={FIXED_COST_EXAMPLES}
              />
            </div>
            
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {state.fixedCosts.map((cost) => (
                <div key={cost.id} className="flex gap-3 items-center bg-white p-2 rounded border border-gray-200 shadow-sm">
                  <div className="flex-1">
                    <CostInputWithSuggestions
                      placeholder="Nome do custo (ex: Aluguel)"
                      value={cost.name}
                      onChange={(e) => actions.updateFixedCost(cost.id, 'name', e.target.value)}
                      suggestions={FIXED_COST_EXAMPLES}
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="0,00"
                      value={cost.value}
                      onChange={(e) => actions.updateFixedCost(cost.id, 'value', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border rounded text-sm text-right focus:ring-2 focus:ring-blue-300 outline-none"
                      min="0"
                    />
                  </div>
                  <button 
                    onClick={() => actions.removeFixedCost(cost.id)}
                    className="text-gray-400 hover:text-red-500 p-2"
                    title="Remover"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {state.fixedCosts.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">Nenhum custo fixo cadastrado.</p>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-700">
                <span>Total Fixos:</span>
                <span>R$ {results.totalFixedCosts.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* 2. Impostos */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-green-500 pb-1 inline-block">
                2. Impostos e Taxas Padrão
              </h3>
              <button 
                onClick={actions.addTax}
                className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
              >
                + Adicionar Imposto
              </button>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {state.taxes.map((tax) => (
                <div key={tax.id} className="flex gap-3 items-center bg-white p-2 rounded border border-gray-200 shadow-sm">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Nome do imposto (ex: Simples)"
                      value={tax.name}
                      onChange={(e) => actions.updateTax(tax.id, 'name', e.target.value)}
                      className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-green-300 outline-none"
                    />
                  </div>
                  <div className="w-24 flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={tax.value}
                      onChange={(e) => actions.updateTax(tax.id, 'value', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border rounded text-sm text-right focus:ring-2 focus:ring-green-300 outline-none"
                      min="0"
                    />
                    <span className="text-gray-500">%</span>
                  </div>
                  <button 
                    onClick={() => actions.removeTax(tax.id)}
                    className="text-gray-400 hover:text-red-500 p-2"
                    title="Remover"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {state.taxes.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">Nenhum imposto cadastrado.</p>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-700">
                <span>Total Impostos:</span>
                <span>{results.totalTaxesPercent.toFixed(2)}%</span>
              </div>
            </div>
          </section>

          {/* 3. Taxas de Venda (Cartão, Marketplace, etc) */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-orange-500 pb-1 inline-block">
                3. Taxas de Venda (Cartão, MktPlace)
              </h3>
              <button 
                onClick={actions.addSalesFee}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium transition-colors"
              >
                + Adicionar
              </button>
            </div>
            
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {state.salesFees && state.salesFees.map((fee) => (
                <div key={fee.id} className="flex gap-3 items-center bg-white p-2 rounded border border-gray-200 shadow-sm">
                  <div className="flex-1">
                    <CostInputWithSuggestions
                      placeholder="Nome da taxa (ex: Taxa Cartão)"
                      value={fee.name}
                      onChange={(e) => actions.updateSalesFee(fee.id, 'name', e.target.value)}
                      suggestions={['Taxa Cartão Crédito', 'Taxa Cartão Débito', 'Taxa Marketplace', 'Comissão Vendedor', 'Taxa Antecipação']}
                    />
                  </div>
                  <div className="w-32 relative">
                    <input
                      type="number"
                      placeholder="0,00"
                      value={fee.value}
                      onChange={(e) => actions.updateSalesFee(fee.id, 'value', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 pr-8 border rounded text-sm text-right focus:ring-2 focus:ring-blue-300 outline-none"
                      min="0"
                    />
                    <span className="absolute right-2 top-2 text-gray-400 text-sm">%</span>
                  </div>
                  <button 
                    onClick={() => actions.removeSalesFee(fee.id)}
                    className="text-gray-400 hover:text-red-500 p-2"
                    title="Remover"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {(!state.salesFees || state.salesFees.length === 0) && (
                <p className="text-center text-gray-400 text-sm py-4">Nenhuma taxa de venda cadastrada.</p>
              )}
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 px-6 py-4 flex justify-end shadow-inner z-10">
        <button 
          onClick={isScreen ? () => {} : onClose}
          className={`px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors shadow-sm ${isScreen ? 'opacity-50 cursor-default' : ''}`}
        >
          {isScreen ? 'Alterações salvas automaticamente' : 'Concluir Configuração'}
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
