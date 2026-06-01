# Nlar Controle de Midia

Monorepo para controle de contratos de midia da Nosso Lar. O produto principal e o app Next.js em `apps/web`, publicado sob o base path `/controle-de-midias`.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Monorepo | npm workspaces + Turborepo 2.9 |
| Frontend | Next.js 16, React 19, Tailwind 4 |
| Banco | SQL Server via Knex (`@repo/db`) |
| Auth | JWT em cookies + servicos `NLAR_AUTH` / `NLAR_USER` |
| UI corporativa | `@DevsNossoLar/ui-theme`, `@DevsNossoLar/user-shared` |

## Estrutura

```
apps/
  web/          # Aplicacao principal (porta 3010 em dev)
  docs/         # App de exemplo do Turborepo (porta 3001)
packages/
  db/           # @repo/db - repositorios e scripts SQL
  types/        # @repo/types
  ui/           # @repo/ui - componentes compartilhados
  eslint-config/
  typescript-config/
```

## Desenvolvimento local

Na raiz do repositorio, defina um [PAT do GitHub](https://github.com/settings/tokens) com `read:packages` e exporte antes do install:

```bash
# PowerShell
$env:NODE_AUTH_TOKEN = "ghp_..."

# bash
export NODE_AUTH_TOKEN=ghp_...

npm install
npm run dev
```

O `.npmrc` usa `${NODE_AUTH_TOKEN}` — nunca commite o token no repositório.

- **Web:** http://localhost:3010/controle-de-midias
- **Docs:** http://localhost:3001

### Variaveis de ambiente

**`packages/db/.env`** (SQL Server):

- `HOST`, `USER`, `PASSWORD`, `DATABASE`

**`apps/web`** (integracao NLAR):

- `NLAR_AUTH` - login, refresh e validacao de token
- `NLAR_USER` - perfil e permissao do servico
- `NLAR_HOMEPAGE` - URL de login quando nao ha sessao
- `x-service-id` (ou equivalente) para verificacao de permissao na plataforma

O login ocorre via portal corporativo / SSO; nao ha tela de login isolada neste repositorio.

### Scripts SQL

Scripts em `packages/db/sql/` - ver tambem `packages/db/sql/README.md`.

**Padrao de IDs:** tabelas `NS_controle_de_midia_*` usam `INT IDENTITY(1,1)` na PK e nas FKs entre si. Codigos de fornecedor/loja ficam em `NVARCHAR(36)` (`codFor`, `codLoja`).

**Ambiente novo:** `003` -> `004` -> `005` -> `008` (historico opcional)

**Banco legado com GUID em contratos:** `006` -> `004` -> `005` -> `008` (historico opcional)

## Autenticacao

1. **SSO** - `GET /api/auth/sso` grava cookies `access_token` e `refresh_token`.
2. **Paginas** - `apps/web/app/proxy.ts` redireciona para `NLAR_HOMEPAGE` sem cookies; renova o access token quando so ha refresh.
3. **Permissao** - `UserContext` chama `/api/user/verificar-permissao-para-usar-plataforma` antes de liberar o app.
4. **APIs de dominio** - rotas de contratos, anexos, fornecedores e lojas validam sessao antes de executar.

Rotas `/api/*` nao passam pelo proxy; a validacao e feita em cada handler.

## Modulos

| Rota | Descricao |
|------|-----------|
| `/dashboard` | Painel com atalhos |
| `/contratos` | Listagem, filtros, criacao, edicao, detalhes, cancelar/encerrar |
| `/contratos/[id]` | Detalhes do contrato e anexos em base64 no banco |
| `/acesso-negado` | Sem permissao no servico |

## API

Todas exigem sessao valida.

| Metodo | Rota | Acao |
|--------|------|------|
| GET/POST | `/api/contratos` | Listar / criar contratos |
| GET/PATCH/PUT | `/api/contratos/[id]` | Detalhe / atualizar contrato |
| PATCH | `/api/contratos/[id]/cancelar` | Cancelar contrato |
| PATCH | `/api/contratos/[id]/encerrar` | Encerrar contrato |
| GET/POST | `/api/contratos/[id]/anexos` | Listar / upload anexo |
| GET/DELETE | `/api/contratos/[id]/anexos/[anexoId]` | Abrir / remover anexo |
| GET | `/api/contratos/condicoes-pagamento` | Condicoes de pagamento |
| GET | `/api/contratos/formas-pagamento` | Formas de pagamento |
| GET | `/api/fornecedores` | Busca de fornecedores |
| GET | `/api/lojas` | Busca de lojas |

Validacao de payload: `apps/web/app/lib/schemas/contrato.schema.ts` e `apps/web/app/lib/schemas/contrato-anexo.schema.ts`.

Persistencia: `ContratosRepository` e `ContratosAnexosRepository` em `packages/db`.

## Scripts uteis

```bash
npm run build        # build de todos os pacotes/apps
npm run lint         # ESLint
npm run check-types  # TypeScript
npm run format       # Prettier
```

## Estado atual

| Area | Status |
|------|--------|
| Auth SSO + permissao por servico | Integrado com NLAR |
| CRUD contratos | Implementado |
| Anexos de contratos | Implementado |
| Fornecedores / lojas na API | Integrado aos contratos |
| Escopo atual | Contratos e anexos |
| App `docs` | Template Turborepo, nao e o produto |
