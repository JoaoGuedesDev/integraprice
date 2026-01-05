import React from 'react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${color} text-white`}>
      {icon}
    </div>
  </div>
);

const Dashboard = ({ savedProducts, openCalculator, openReports }) => {
  const totalProducts = savedProducts.length;
  const totalRevenuePotential = savedProducts.reduce((acc, p) => acc + (p.monthlyRevenue || 0), 0);
  const totalProfitPotential = savedProducts.reduce((acc, p) => acc + (p.monthlyProfit || 0), 0);
  const avgMargin = totalProducts > 0 
    ? savedProducts.reduce((acc, p) => acc + (p.realMargin || 0), 0) / totalProducts 
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Bem-vindo ao IntegraPrice! 🚀</h2>
        <p className="text-blue-100 max-w-2xl">
          Aqui você tem o controle total da precificação dos seus produtos. 
          Use o menu lateral para navegar ou os atalhos abaixo.
        </p>
        <div className="mt-6 flex gap-4">
          <button 
            onClick={openCalculator}
            className="px-6 py-2 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-blue-50 transition-colors"
          >
            Nova Precificação
          </button>
          <button 
            onClick={openReports}
            className="px-6 py-2 bg-blue-700 bg-opacity-50 text-white font-semibold rounded-lg hover:bg-opacity-70 transition-colors"
          >
            Ver Relatórios
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Produtos Cadastrados" 
          value={totalProducts} 
          icon={<span className="text-xl">📦</span>}
          color="bg-blue-500"
        />
        <StatCard 
          title="Faturamento Estimado" 
          value={`R$ ${totalRevenuePotential.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={<span className="text-xl">💰</span>}
          color="bg-green-500"
        />
        <StatCard 
          title="Lucro Estimado" 
          value={`R$ ${totalProfitPotential.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={<span className="text-xl">📈</span>}
          color="bg-indigo-500"
        />
        <StatCard 
          title="Margem Média" 
          value={`${avgMargin.toFixed(1)}%`} 
          icon={<span className="text-xl">🎯</span>}
          color="bg-purple-500"
        />
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Produtos Recentes</h3>
          <button onClick={openReports} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Ver todos</button>
        </div>
        {savedProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhum produto cadastrado ainda. Comece sua primeira precificação!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">Produto</th>
                  <th className="px-6 py-3 font-semibold">Preço Final</th>
                  <th className="px-6 py-3 font-semibold">Margem</th>
                  <th className="px-6 py-3 font-semibold">Lucro Unit.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {savedProducts.slice(-5).reverse().map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-800">{product.name}</td>
                    <td className="px-6 py-3 text-gray-600">R$ {product.finalPrice?.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        (product.realMargin || 0) >= 20 ? 'bg-green-100 text-green-700' : 
                        (product.realMargin || 0) >= 10 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {(product.realMargin || 0).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-3 text-green-600 font-medium">R$ {product.unitProfit?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
