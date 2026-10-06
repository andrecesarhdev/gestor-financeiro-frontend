# Poupa+ | Gestor Financeiro (Frontend)

Aplicação web para gestão de finanças pessoais, construída com React, TypeScript e Tailwind CSS. Consome a API REST do Poupa+ e oferece uma interface completa para controle de receitas, despesas e visualização de relatórios financeiros.

🔗 **Aplicação em produção:** [gestor-financeiro-frontend-flame.vercel.app](https://gestor-financeiro-frontend-flame.vercel.app/login)
🔗 **Documentação da API (Swagger):** [gestor-financeiro-api-1369.onrender.com/docs](https://gestor-financeiro-api-1369.onrender.com/docs)
🔗 **Repositório do backend:** [gestor-financeiro-backend](https://github.com/andrecesarhdev/gestor-financeiro-backend)

> ⏳ **Primeiro acesso:** a API está hospedada no plano gratuito do Render, que entra em modo de espera após um período sem uso. O primeiro login pode levar até 1 minuto. Depois disso, a navegação fica rápida.

---

## Funcionalidades

- Cadastro e login de usuário, com sessão persistida
- Dashboard com resumo financeiro (receitas, despesas e saldo) e gráficos de barras por categoria
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
| Deploy | Vercel, com deploy contínuo a cada push |

## Arquitetura

O projeto é organizado por features (domínios), e não por tipo de arquivo:

```
src/
├── features/
│   ├── auth/           # Login, cadastro, contexto de autenticação e proteção de rotas
│   ├── categories/     # CRUD de categorias
│   ├── transactions/   # CRUD de transações
│   └── dashboard/      # Resumo financeiro e gráficos
├── components/         # Componentes genéricos reutilizáveis (layout, modais)
├── lib/                # Configuração do Axios e do TanStack Query
└── routes/             # Configuração de rotas
```

Cada feature contém seus próprios componentes, hooks, services (comunicação com a API) e schemas de validação, mantendo todo o código de um domínio agrupado em um só lugar.

A autenticação usa Context API para compartilhar o estado do usuário logado por toda a aplicação. O token JWT fica salvo no localStorage e é anexado automaticamente a cada requisição por um interceptor do Axios.

## Rodando localmente

### Pré-requisitos

- Node.js 20+
- O backend rodando localmente (veja as instruções no [repositório do backend](https://github.com/andrecesarhdev/gestor-financeiro-backend))

### Passos

```bash
git clone https://github.com/andrecesarhdev/gestor-financeiro-frontend.git
cd gestor-financeiro-frontend
npm install
cp .env.example .env
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

Por padrão, o `.env` aponta para `http://localhost:3000`, onde roda o backend local. Se o backend estiver em outro endereço, ajuste a variável `VITE_API_URL`.

## Decisões técnicas

- **TanStack Query em vez de useState e useEffect manuais:** cache automático, invalidação declarativa entre features (criar uma transação atualiza o dashboard automaticamente) e menos código repetitivo de carregamento e erro.
- **Zod para validação:** o mesmo schema gera a validação e o tipo TypeScript do formulário, sem duplicar a definição dos dados.
- **Paleta de cores por tipo:** categorias de receita e de despesa usam famílias de cores diferentes, o que facilita a leitura dos gráficos e das listas sem depender só do texto.

## Autor

**André César**, Desenvolvedor Full Stack Jr

- Portfólio: [andrecesar-dev.vercel.app](https://andrecesar-dev.vercel.app)
- LinkedIn: [linkedin.com/in/andrecesar-dev](https://www.linkedin.com/in/andrecesar-dev/)
- E-mail: andrecesarprogramador@gmail.com

## Licença

Projeto desenvolvido para fins de portfólio.
