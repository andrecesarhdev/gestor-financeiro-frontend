# Poupa+ — Frontend

Aplicação web para gestão de finanças pessoais, construída com React, TypeScript e Tailwind CSS. Consome a API REST do backend do Poupa+, oferecendo uma interface completa para controle de receitas, despesas e visualização de relatórios financeiros.

Aplicação em produção: (link após o deploy)
Repositório do backend: https://github.com/andrecesarhdev/gestor-financeiro-backend

---

## Funcionalidades

- Cadastro e login de usuário, com sessão persistida
- Dashboard com resumo financeiro (receitas, despesas, saldo) e gráficos de barras por categoria
- Gestão completa de categorias, com paleta de cores diferenciada para receitas e despesas
- Gestão completa de transações, com seleção de categoria filtrada automaticamente pelo tipo
- Interface responsiva, adaptada para desktop e mobile

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Build tool | Vite |
| Biblioteca | React 19 |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS v4 |
| Roteamento | React Router |
| Estado do servidor | TanStack Query |
| Formulários | React Hook Form + Zod |
| Gráficos | Recharts |
| Requisições HTTP | Axios |

## Arquitetura

O projeto é organizado por features (domínios), não por tipo de arquivo:
src/
├── features/
│ ├── auth/ # Login, cadastro, contexto de autenticação, proteção de rotas
│ ├── categories/ # CRUD de categorias
│ ├── transactions/ # CRUD de transações
│ └── dashboard/ # Resumo financeiro e gráficos
├── components/ # Componentes genéricos reutilizáveis (layout, modais)
├── lib/ # Configuração de Axios e TanStack Query
└── routes/ # Configuração de rotas

Cada feature contém seus próprios componentes, hooks, services (comunicação com a API) e schemas de validação, mantendo o código relacionado a um domínio agrupado em um só lugar.

A autenticação usa Context API para compartilhar o estado do usuário logado por toda a aplicação, com o token JWT persistido em localStorage e anexado automaticamente a cada requisição via interceptor do Axios.

## Rodando localmente

### Pré-requisitos
- Node.js 20+
- O backend rodando localmente (veja o repositório do backend para instruções)

### Passos

```bash
git clone https://github.com/andrecesarhdev/gestor-financeiro-frontend.git
cd gestor-financeiro-frontend

npm install

cp .env.example .env

npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

Por padrão, o `.env` aponta para `http://localhost:3000` (o backend rodando localmente). Ajuste `VITE_API_URL` se o backend estiver em outro endereço.

## Decisões técnicas

- **TanStack Query em vez de useState/useEffect manual**: cache automático, invalidação declarativa entre features (criar uma transação atualiza o dashboard automaticamente) e menos código repetitivo de loading/erro.
- **Zod para validação**: o mesmo schema gera a validação e o tipo TypeScript do formulário, evitando duplicar a definição dos dados.
- **Paleta de cores por tipo**: categorias de receita e despesa usam famílias de cores distintas, facilitando a leitura dos gráficos e listas sem depender apenas do texto.

## Licença

Este projeto foi desenvolvido para fins de portfólio.