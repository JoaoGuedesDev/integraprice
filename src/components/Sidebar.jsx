import React from 'react';

const Sidebar = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'calculator', label: 'Calculadora', icon: '🧮' },
    { id: 'general', label: 'Dados Gerais', icon: '📋' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' },
    { id: 'reports', label: 'Relatórios', icon: '📈' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">CalculaAi</h1>
        <p className="text-xs text-gray-400 mt-1">Precificação Inteligente</p>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
              currentView === item.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; 2025 CalculaAi
      </div>
    </aside>
  );
};

export default Sidebar;
