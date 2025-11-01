<div align="center">
  <h1>🎯 IntegraPrice</h1>
  <p><strong>Sistema Inteligente de Precificação</strong></p>
  
  [![CI/CD Pipeline](https://github.com/username/integraprice/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/username/integraprice/actions/workflows/ci-cd.yml)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
</div>

## 📋 Sobre o Projeto

O **IntegraPrice** é uma solução moderna e intuitiva para cálculo e análise de precificação de produtos. Desenvolvido com as mais recentes tecnologias web, oferece uma interface elegante e funcionalidades avançadas para empresas calcularem preços ideais baseados em custos, margens e volumes esperados.

### 🎯 Objetivos
- Simplificar o processo de precificação de produtos
- Fornecer análises detalhadas de viabilidade financeira
- Oferecer recomendações estratégicas baseadas em dados
- Facilitar a tomada de decisões empresariais

## ✨ Funcionalidades

### 🧮 **Calculadora de Preços Inteligente**
- Formulário intuitivo com validação em tempo real
- Cálculo automático de preço sugerido
- Suporte a custos variáveis e fixos
- Análise de margem de lucro

### 📊 **Visualização e Análise**
- Gráficos interativos de resultados
- Análise de break-even point
- Comparação de cenários
- Projeções de lucro

### 📈 **Sistema de Análise de Risco**
- Score de risco automatizado
- Identificação de fatores críticos
- Recomendações estratégicas
- Alertas de sustentabilidade

### 📋 **Gestão e Histórico**
- Histórico completo de precificações
- Comparação entre produtos
- Exportação de dados
- Dashboard executivo

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Next.js** | 14.x | Framework React com App Router |
| **React** | 18.x | Biblioteca para interfaces de usuário |
| **TypeScript** | 5.x | Tipagem estática para JavaScript |
| **Tailwind CSS** | 3.x | Framework CSS utilitário |
| **React Hook Form** | 7.x | Gerenciamento de formulários |
| **Zod** | 3.x | Validação de esquemas |
| **Recharts** | 2.x | Biblioteca de gráficos |
| **Radix UI** | 1.x | Componentes acessíveis |
| **Lucide React** | Latest | Ícones modernos |

## 📦 Instalação e Configuração

### 📋 **Pré-requisitos**

Certifique-se de ter instalado:
- **Node.js** 18.0 ou superior
- **npm** 9.0 ou superior (ou **yarn** 1.22+)
- **Git** para controle de versão

### 🔧 **Instalação Rápida**

1. **Clone o repositório**
   `ash
   git clone https://github.com/username/integraprice.git
   cd integraprice
   `

2. **Instale as dependências**
   `ash
   npm install
   # ou
   yarn install
   `

3. **Configure as variáveis de ambiente**
   `ash
   cp .env.example .env.local
   `
   
   Edite o arquivo .env.local com suas configurações:
   `env
   # Configurações da aplicação
   NEXT_PUBLIC_APP_NAME=IntegraPrice
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   
   # Configurações de desenvolvimento
   NODE_ENV=development
   `

4. **Execute o servidor de desenvolvimento**
   `ash
   npm run dev
   # ou
   yarn dev
   `

5. **Acesse a aplicação**
   `
   http://localhost:3000
   `

### 🏗️ **Scripts Disponíveis**

`ash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Gera build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linter
npm run type-check   # Verifica tipos TypeScript
`

## 🏗️ Estrutura do Projeto

`
integraprice/
├── 📁 .github/              # Configurações GitHub
│   └── workflows/           # GitHub Actions
├── �� public/               # Arquivos estáticos
├── �� src/                  # Código fonte
│   ├── 📁 app/             # App Router (Next.js 14)
│   │   ├── globals.css     # Estilos globais
│   │   ├── layout.tsx      # Layout principal
│   │   └── page.tsx        # Página inicial
│   ├── 📁 components/      # Componentes React
│   │   ├── 📁 forms/       # Formulários
│   │   ├── 📁 charts/      # Gráficos e visualizações
│   │   └── 📁 ui/          # Componentes base
│   ├── 📁 hooks/           # Custom Hooks
│   ├── 📁 lib/             # Utilitários e configurações
│   └── 📁 types/           # Definições TypeScript
├── 📄 .gitignore           # Arquivos ignorados pelo Git
├── 📄 LICENSE              # Licença MIT
├── 📄 README.md            # Documentação
├── 📄 package.json         # Dependências e scripts
├── 📄 tailwind.config.ts   # Configuração Tailwind
└── 📄 tsconfig.json        # Configuração TypeScript
`

## 🎯 Como Usar

### 1. **Calculadora de Preços**
1. Acesse a página principal
2. Preencha os campos obrigatórios:
   - **Nome do Produto**: Identificação única
   - **Custo Variável (R\$)**: Custo por unidade
   - **Custo Fixo Mensal (R\$)**: Custos fixos
   - **Margem de Lucro (%)**: Percentual desejado
   - **Volume Mensal**: Quantidade esperada
3. Visualize o preço sugerido em tempo real
4. Clique em "Calcular Precificação" para análises detalhadas

### 2. **Análise de Resultados**
- 📊 Gráficos de break-even point
- 💰 Distribuição de custos
- 📈 Projeções de lucro
- ⚖️ Comparação de cenários

### 3. **Gestão de Risco**
- 🎯 Monitore o score de risco
- ⚠️ Revise fatores identificados
- 💡 Implemente recomendações
- 🔄 Ajuste parâmetros

## 📊 Fórmulas e Cálculos

### **Preço Sugerido**
`
Custo Fixo por Unidade = Custo Fixo Mensal ÷ Volume Esperado
Custo Total por Unidade = Custo Variável + Custo Fixo por Unidade
Preço Sugerido = Custo Total por Unidade ÷ (1 - Margem ÷ 100)
`

### **Break-Even Point**
`
Ponto de Equilíbrio = Custo Fixo ÷ (Preço - Custo Variável)
`

### **Score de Risco**
- Margem < 20%: +30 pontos
- Volume < 50 unidades: +25 pontos
- Custo fixo/unidade > Custo variável: +20 pontos
- Margem > 50%: +15 pontos

## 🚀 Deploy e Produção

### **Vercel (Recomendado)**
`ash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
`

### **Docker**
`ash
# Build da imagem
docker build -t integraprice .

# Executar container
docker run -p 3000:3000 integraprice
`

### **Variáveis de Ambiente - Produção**
`env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
VERCEL_URL=seu-projeto.vercel.app
`

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (git checkout -b feature/AmazingFeature)
3. **Commit** suas mudanças (git commit -m 'Add some AmazingFeature')
4. **Push** para a branch (git push origin feature/AmazingFeature)
5. **Abra** um Pull Request

### **Padrões de Código**
- Use **TypeScript** para tipagem
- Siga as convenções do **ESLint**
- Escreva **testes** para novas funcionalidades
- Documente **mudanças** no README

## 📝 Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte e Contato

- 📧 **Email**: suporte@integraprice.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/username/integraprice/issues)
- 📖 **Documentação**: [Wiki do Projeto](https://github.com/username/integraprice/wiki)
- 💬 **Discussões**: [GitHub Discussions](https://github.com/username/integraprice/discussions)

## 🔄 Roadmap

### **Versão Atual (1.0.0)**
- ✅ Sistema de precificação básico
- ✅ Interface moderna e responsiva
- ✅ Análise de risco automatizada
- ✅ Gráficos interativos
- ✅ Histórico de precificações

### **Próximas Versões**
- 🔄 **v1.1.0** - Integração com APIs de mercado
- 🔄 **v1.2.0** - Análise competitiva
- 🔄 **v1.3.0** - Relatórios avançados
- 🔄 **v2.0.0** - Sistema de usuários e autenticação
- 🔄 **v2.1.0** - Dashboard executivo

## 📈 Status do Projeto

![GitHub last commit](https://img.shields.io/github/last-commit/username/integraprice)
![GitHub issues](https://img.shields.io/github/issues/username/integraprice)
![GitHub pull requests](https://img.shields.io/github/issues-pr/username/integraprice)
![GitHub stars](https://img.shields.io/github/stars/username/integraprice)

---

<div align="center">
  <p><strong>IntegraPrice</strong> - Transformando dados em decisões inteligentes de precificação.</p>
  <p>Feito com ❤️ pela equipe IntegraPrice</p>
</div>
