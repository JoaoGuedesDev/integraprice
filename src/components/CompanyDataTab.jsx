import React from 'react';

const CompanyDataTab = ({ state, actions }) => {
  const { companyInfo } = state;
  const { updateCompanyInfo } = actions;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dados Gerais da Empresa</h2>
      <p className="text-gray-600 mb-8">Preencha as informações cadastrais da sua empresa.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identificação */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Identificação</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
            <input
              type="text"
              value={companyInfo.legalName}
              onChange={(e) => updateCompanyInfo('legalName', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="Ex: Minha Empresa LTDA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
            <input
              type="text"
              value={companyInfo.tradeName}
              onChange={(e) => updateCompanyInfo('tradeName', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="Ex: Minha Loja"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
            <input
              type="text"
              value={companyInfo.cnpj}
              onChange={(e) => updateCompanyInfo('cnpj', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="00.000.000/0001-00"
            />
          </div>
        </div>

        {/* Contato */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Contato</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={companyInfo.email}
              onChange={(e) => updateCompanyInfo('email', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="contato@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
            <input
              type="text"
              value={companyInfo.phone}
              onChange={(e) => updateCompanyInfo('phone', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Endereço</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
            <input
              type="text"
              value={companyInfo.address.zipCode}
              onChange={(e) => updateCompanyInfo('zipCode', e.target.value, true)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="00000-000"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro (Rua/Av)</label>
            <input
              type="text"
              value={companyInfo.address.street}
              onChange={(e) => updateCompanyInfo('street', e.target.value, true)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="Rua das Flores"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
            <input
              type="text"
              value={companyInfo.address.number}
              onChange={(e) => updateCompanyInfo('number', e.target.value, true)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="123"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
            <input
              type="text"
              value={companyInfo.address.complement}
              onChange={(e) => updateCompanyInfo('complement', e.target.value, true)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="Sala 101"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
            <input
              type="text"
              value={companyInfo.address.neighborhood}
              onChange={(e) => updateCompanyInfo('neighborhood', e.target.value, true)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="Centro"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input
              type="text"
              value={companyInfo.address.city}
              onChange={(e) => updateCompanyInfo('city', e.target.value, true)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="São Paulo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado (UF)</label>
            <input
              type="text"
              value={companyInfo.address.state}
              onChange={(e) => updateCompanyInfo('state', e.target.value, true)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="SP"
              maxLength={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDataTab;
