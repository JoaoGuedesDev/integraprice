import React, { useState } from 'react';
import { useCalculator } from './hooks/useCalculator';
import Sidebar from './components/Sidebar';
import CostsTab from './components/CostsTab';
import MarginTab from './components/MarginTab';
import VolumeTab from './components/VolumeTab';
import ResultPanel from './components/ResultPanel';
import SettingsModal from './components/SettingsModal';
import CompanyDataTab from './components/CompanyDataTab';
import ReportsTab from './components/ReportsTab';

function App() {
  const { state, setters, actions, results } = useCalculator();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Kept for modal access if needed, but sidebar uses view switching

  // If sidebar "Configurações" is clicked, we switch view to 'settings'
  // If we want to open modal from inside Dashboard, we can use openSettings (optional)
  const openSettings = () => setCurrentView('settings');

  const renderContent = () => {
    switch (currentView) {
      case 'general':
        return (
          <div className="h-full">
            <CompanyDataTab 
              state={state} 
              actions={actions} 
            />
          </div>
        );
      case 'reports':
        return (
          <div className="h-full p-6 bg-gray-50 overflow-y-auto">
            <ReportsTab 
              state={state} 
              actions={actions}
            />
          </div>
        );
      case 'settings':
        return (
          <div className="h-full">
            <SettingsModal 
              isOpen={true} 
              onClose={() => setCurrentView('dashboard')} 
              state={state} 
              actions={actions} 
              results={results}
              isScreen={true}
            />
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Product Inputs */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Section 0: Product Info */}
            <section id="product-info" className="bg-white p-6 rounded-lg shadow border border-gray-200">
               <div className="flex justify-between items-start mb-4">
                 <h3 className="text-lg font-bold text-gray-800">Dados do Produto</h3>
                 <button 
                   onClick={actions.saveProduct}
                   className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700 transition-colors flex items-center gap-2"
                 >
                   <span>💾</span> Salvar Produto
                 </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                     <input
                       type="text"
                       placeholder="Ex: Camiseta Estampada"
                       value={state.productInfo.name}
                       onChange={(e) => actions.updateProductInfo('name', e.target.value)}
                       className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">SKU / Código (Opcional)</label>
                     <input
                       type="text"
                       placeholder="Ex: CAM-001"
                       value={state.productInfo.sku}
                       onChange={(e) => actions.updateProductInfo('sku', e.target.value)}
                       className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
                     />
                   </div>
                 </div>
              </section>

              {/* Section 1: Product Costs */}
              <section id="costs">
                <CostsTab 
                  state={state} 
                  actions={actions} 
                  setters={setters} 
                  results={results} 
                  openSettings={openSettings} 
                />
              </section>

              {/* Section 2: Margin */}
              <section id="margin">
                 <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">2. Margem e Impostos</h3>
                    <MarginTab 
                      state={state} 
                      actions={actions} 
                      setters={setters} 
                      results={results}
                      openSettings={openSettings} 
                    />
                 </div>
              </section>

              {/* Section 3: Volume */}
              <section id="volume">
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">3. Volume de Vendas Estimado</h3>
                    <VolumeTab state={state} setters={setters} results={results} />
                </div>
              </section>

            </div>

            {/* Right Column: Results Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <ResultPanel results={results} desiredMargin={state.desiredMargin} />
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                  <p className="font-semibold mb-2">💡 Dica:</p>
                  <p>Os custos fixos (definidos nas Configurações) são rateados pelo volume de vendas deste produto.</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex flex-row">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {/* Header Title based on view */}
        <header className="mb-8">
           <h1 className="text-3xl font-bold text-gray-900">
             {currentView === 'dashboard' ? 'Calculadora de Precificação' : 
              currentView === 'settings' ? '' : // Settings has its own header
              currentView === 'general' ? 'Dados Gerais' :
              'Relatórios'}
           </h1>
           {currentView === 'dashboard' && (
             <p className="text-gray-600 mt-2">Defina os custos variáveis e volume para precificar seu produto.</p>
           )}
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

export default App;
