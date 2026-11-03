# Nlar Controle de Midia

Monorepo da plataforma de controle de contratos de midia da Nosso Lar. O produto principal e o app Next.js em `apps/web`, publicado sob o base path `/controle-de-midias`.

## Sobre a plataforma

A plataforma centraliza os contratos de midia e servicos de marketing (televisao, radio, outdoor, influencer, trafego pago, licencas etc.) firmados entre fornecedores e lojas da rede, e acompanha o pagamento de cada contrato a partir das parcelas lancadas no ERP.

Fluxo geral:

1. **Contrato** - cadastro com fornecedor, loja, tipo, vigencia, valores, condicao/forma de pagamento e numero de previsao/cotacao do ERP.
2. **Anexos do contrato** - contrato assinado, proposta, aditivo etc., armazenados em base64 no banco.
3. **Parcelas** - lidas do ERP (contas a pagar em aberto e baixas pagas) a partir do numero de previsao do contrato.
4. **Comprovacao financeira** - por parcela, o usuario anexa comprovante, boleto ou Nota Fiscal (com numero da NF-e).
5. **Relatorio mensal** - visao consolidada do mes: a pagar, pago e previsto por tipo de contrato, com quantidade de anexos por parcela.

Acesso via portal corporativo (SSO NLAR), liberado apenas para usuarios com permissao no servico.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Monorepo | npm workspaces + Turborepo 2.9 |
| Frontend | Next.js 16 (App Router), React 19, Tailwind 4 |
| Banco | SQL Server via Knex (`@repo/db`) |
| Auth | JWT em cookies + servicos `NLAR_AUTH` / `NLAR_USER` |
| UI corporativa | `@DevsNossoLar/ui-theme` (layout, chat), `@DevsNossoLar/user-shared` |
| Feedback | `sonner` (toasts) |
| Deploy | Docker (Node 20 alpine) |

## Estrutura

```
apps/
  web/          # Aplicacao principal (porta 3005 em dev, 3010 em producao)
  docs/         # App de exemplo do Turborepo (porta 3001)
packages/
  db/           # @repo/db - repositorios, consultas ao ERP e scripts SQL
  types/        # @repo/types
  ui/           # @repo/ui - componentes compartilhados
  eslint-config/
  typescript-config/
```

Dentro de `apps/web/app`, cada modulo segue o padrao App Router com pastas privadas proximas da rota (`_components`, `_hooks`, `_services`, `_types`, `_utils`). As rotas autenticadas ficam no grupo `(usuarioLogado)`.

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

O `.npmrc` usa `${NODE_AUTH_TOKEN}` — nunca commite o token no repositorio.

- **Web (dev):** http://localhost:3005/controle-de-midias
- **Web (`npm run start`):** http://localhost:3010/controle-de-midias
- **Docs:** http://localhost:3001

Ha tambem um `.devcontainer/devcontainer.json` para desenvolvimento em container.

### Variaveis de ambiente

**`packages/db/.env`** (SQL Server):

- `HOST`, `USER`, `PASSWORD`, `DATABASE`

**`apps/web`** (integracao NLAR):

- `NLAR_AUTH` - login, refresh e validacao de token
- `NLAR_USER` - perfil e permissao do servico
- `NLAR_HOMEPAGE` - URL de login quando nao ha sessao
- `x-service-id` (ou equivalente) para verificacao de permissao na plataforma

O login ocorre via portal corporativo / SSO; nao ha tela de login isolada neste repositorio.

## Autenticacao

1. **SSO** - `GET /api/auth/sso` grava cookies `access_token` e `refresh_token`.
2. **Paginas** - `apps/web/app/proxy.ts` redireciona para `NLAR_HOMEPAGE` sem cookies; renova o access token quando so ha refresh.
3. **Permissao** - `UserContext` chama `/api/user/verificar-permissao-para-usar-plataforma` antes de liberar o app; sem permissao, o usuario vai para `/acesso-negado`.
4. **APIs de dominio** - cada handler valida a sessao com `tokenAtivo()` antes de executar.

Rotas `/api/*` nao passam pelo proxy; a validacao e feita em cada handler.

## Modulos

| Rota | Descricao |
|------|-----------|
| `/dashboard` | Resumo do mes corrente (a pagar, pago, previsto, parcelas abertas/pagas) e atalhos para contratos e relatorio |
| `/contratos` | Listagem com busca geral e filtros (status, tipo, fornecedor, loja, periodo) e acoes por linha |
| `/contratos/novo` | Criacao de contrato, com busca de fornecedor/loja e selecao de condicao/forma de pagamento |
| `/contratos/[id]` | Detalhes, anexos do contrato, dialogo de **Parcelas** e acoes de cancelar/encerrar |
| `/contratos/[id]/editar` | Edicao do contrato |
| `/relatorios/mensal` | Relatorio mensal por ano/mes, loja, fornecedor e situacao (aberto, pago, ambos) |
| `/acesso-negado` | Usuario sem permissao no servico |

### Contratos

- **Tipos de contrato:** televisao, radio, carro de som, painel de LED, correios, frete rapido, outdoor, influencer, comunicacao visual, entrega digital, comissao agencia, Google/Facebook, Lab8, RD Station, AnyMarket, entre outros (`contratoEnum` em `packages/db/src/contratos/types.ts`).
- **Status:** `rascunho`, `ativo`, `suspenso`, `encerrado`, `cancelado`. Cancelar e encerrar alteram o status, sem exclusao fisica.
- **Anexos do contrato:** tipos como contrato, proposta e aditivo; ate 10 arquivos de 5MB cada, em base64.

### Parcelas e anexos financeiros

- As parcelas de um contrato vem do ERP: `contasapagar_tab` (em aberto, origem `ABERTO`) e `PrevisaoCompraBaixas` (pagas, origem `PAGO`).
- Na tela do contrato, o botao **Parcelas** (`contrato-parcelas-dialog.tsx`) mostra situacao, valor, vencimento e anexos de cada parcela; o painel `parcela-anexos-panel.tsx` faz upload, abertura/download e exclusao.
- O registro em `NS_controle_de_midia_lancamento_financeiros` e criado automaticamente no primeiro anexo da parcela (vinculo contrato + origem + chave do ERP).
- **Tipos de anexo da parcela:** `comprovante`, `boleto`, `nota_fiscal`, `outro`.
- **Nota Fiscal:** o campo `numero_nfe` e obrigatorio quando o tipo e `nota_fiscal` (apenas digitos, ate 20).
- Limite de 5MB por arquivo; conteudo armazenado em base64.

### Relatorio mensal

- Consolida parcelas abertas (por vencimento) e pagas (por `DataChegada`) do mes, filtradas por loja e fornecedor.
- Mostra totais (a pagar, pago, previsto pelos contratos), resumo por tipo de contrato e a tabela de parcelas com a quantidade de anexos de cada uma.
- O mesmo endpoint alimenta o resumo do dashboard.

### Layout, chat e notificacoes

- O layout autenticado (`ServicesChatLayoutShell`) usa `LayoutCompleto` do `@DevsNossoLar/ui-theme`, com menu lateral (`nav-lateral.tsx`) e painel de notificacoes.
- **Chat de suporte:** `ChatDock` em modo `suporte`, conectado por WebSocket a `services.marketinglojasnossolar.com.br` (`/chat.io`), com token obtido em `/api/chat/access-token`.
- **Notificacoes globais:** `useGlobalNotifications` consulta `/api/notificacoes-globais/estado` e marca leitura em `/api/notificacoes-globais/marcar-lida` (tabelas `SIM_Chamados_Notificacoes_Globais*`, compartilhadas com o sistema de Chamados).
- `/api/notificacoes` ainda e um stub (retorna lista vazia), pois este app nao integra notificacoes de chamados.

## API

Todas exigem sessao valida.

### Contratos

| Metodo | Rota | Acao |
|--------|------|------|
| GET/POST | `/api/contratos` | Listar / criar contratos |
| GET/PUT/PATCH | `/api/contratos/[id]` | Detalhe / atualizar contrato |
| PATCH | `/api/contratos/[id]/cancelar` | Cancelar contrato |
| PATCH | `/api/contratos/[id]/encerrar` | Encerrar contrato |
| GET/POST | `/api/contratos/[id]/anexos` | Listar / upload de anexo do contrato |
| GET/DELETE | `/api/contratos/[id]/anexos/[anexoId]` | Abrir / remover anexo do contrato |
| GET | `/api/contratos/[id]/parcelas` | Parcelas do contrato (ERP) |
| GET/POST/DELETE | `/api/contratos/[id]/parcelas/anexos` | Listar, abrir, enviar e remover anexos da parcela |
| GET | `/api/contratos/condicoes-pagamento` | Condicoes de pagamento |
| GET | `/api/contratos/formas-pagamento` | Formas de pagamento |

A parcela e identificada por query string: `?origem=ABERTO|PAGO&erpChave=...`. Para abrir ou remover um anexo especifico, acrescente `&anexoId=...`.

### Apoio, relatorios e usuario

| Metodo | Rota | Acao |
|--------|------|------|
| GET | `/api/fornecedores` | Busca de fornecedores |
| GET | `/api/lojas` | Busca de lojas |
| GET | `/api/relatorios/mensal` | Relatorio mensal (ano, mes, loja, fornecedor, situacao) |
| GET | `/api/auth/sso` | Entrada via SSO (grava cookies) |
| GET | `/api/user/me` | Dados do usuario logado |
| GET | `/api/user/verificar-permissao-para-usar-plataforma` | Verifica permissao no servico |
| POST | `/api/user/logout` | Encerra a sessao |
| GET | `/api/chat/access-token` | Token para o chat de suporte |
| GET | `/api/notificacoes-globais/estado` | Notificacao global ativa e estado de leitura |
| POST | `/api/notificacoes-globais/marcar-lida` | Marca notificacao global como lida |
| GET/PUT | `/api/notificacoes` | Stub de notificacoes |
| POST | `/api/notificacoes/marcar-todas-lidas` | Stub de notificacoes |

Validacao de payload em `apps/web/app/lib/schemas/` (`contrato.schema.ts`, `contrato-anexo.schema.ts`, `lancamento-financeiro-anexo.schema.ts`, `relatorio-mensal.schema.ts`).

Persistencia em `packages/db`: `ContratosRepository`, `ContratoAnexosRepository`, `LancamentoFinanceiroRepository`, `LancamentoFinanceiroAnexosRepository` e consultas ao ERP em `packages/db/src/contratos/pagamento` e `packages/db/src/contratos/relatorio`.

## Banco de dados

**Regra geral:** escrita somente em tabelas com prefixo `NS_controle_de_midia_`. Tabelas do ERP/legado sao **somente leitura** (lista canonica em `packages/db/src/shared/erp-readonly.ts`).

| Tabela | Uso |
|--------|-----|
| `NS_controle_de_midia_contratos` | Contratos |
| `NS_controle_de_midia_contrato_anexos` | Anexos do contrato |
| `NS_controle_de_midia_lancamento_financeiros` | Vinculo contrato x parcela do ERP |
| `NS_controle_de_midia_lancamento_financeiro_anexos` | Anexos por parcela (comprovante, boleto, NF) |
| `NS_controle_de_midia_contratos_historico` | Auditoria (criada, ainda sem uso no app) |
| ERP: `fornecedores`, `Parametro2`, `CondicaoPagamento`, `FormaPagamento`, `contasapagar_tab`, `PrevisaoCompraBaixas`, `ENTRADAS` | Somente SELECT |

Detalhes de operacoes por tabela: [TABELAS-CRUD.md](TABELAS-CRUD.md).

### Scripts SQL

Scripts em `packages/db/sql/` - ver tambem [packages/db/sql/README.md](packages/db/sql/README.md).

**Padrao de IDs:** tabelas `NS_controle_de_midia_*` usam `INT IDENTITY(1,1)` na PK e nas FKs entre si. Codigos de fornecedor/loja ficam em `NVARCHAR(36)` (`codFor`, `codLoja`).

**Ambiente novo:** `003` -> `004` -> `005` -> `009` -> `010` -> `011` -> `012` -> `013` -> `008` (historico opcional)

**Banco legado com GUID em contratos:** `006` -> `004` -> `005` -> `009` -> `010` -> `011` -> `012` -> `013` -> `008` (historico opcional)

| Script | Conteudo |
|--------|----------|
| `009` / `010` | Pagamento no contrato e numero de previsao/cotacao |
| `011` | Lancamentos financeiros por parcela + anexos |
| `012` | Tipo `nota_fiscal` nos anexos de parcela |
| `013` | Coluna `numero_nfe` nos anexos de parcela |

## Deploy

O `dockerfile` da raiz faz build multi-stage em `node:20-alpine`:

1. `npm ci` usando o `.npmrc` passado como secret (`--mount=type=secret,id=npmrc`).
2. `npx turbo run build --filter=web` (compila `@repo/types`, `@repo/ui`, `@repo/db` e `apps/web`).
3. Imagem final roda `npm run start` em `apps/web` na porta `3010`, com `dumb-init`.

```bash
docker build --secret id=npmrc,src=.npmrc -t controle-de-midia .
docker run -p 3010:3010 controle-de-midia
```

## Scripts uteis

```bash
npm run build        # build de todos os pacotes/apps
npm run lint         # ESLint
npm run check-types  # TypeScript
npm run format       # Prettier
```

## Historico do que ja foi feito

| Etapa | Entregas |
|-------|----------|
| Base | Monorepo criado com Turborepo (`create-turbo`) |
| Primeira versao | Auth SSO + permissao por servico, CRUD de contratos, anexos de contrato, busca de fornecedores e lojas |
| Pagamento | Condicao e forma de pagamento no contrato, numero de previsao/cotacao do ERP |
| Parcelas | Leitura das parcelas do ERP por contrato e anexos por parcela (comprovante, boleto, outro) |
| Nota Fiscal | Tipo `nota_fiscal` nos anexos de parcela com numero da NF-e obrigatorio |
| Relatorios | Relatorio mensal (a pagar, pago, previsto por tipo) e resumo no dashboard |
| Plataforma | Layout corporativo com menu lateral, chat de suporte, notificacoes globais, logger, Docker e devcontainer |

## Estado atual

| Area | Status |
|------|--------|
| Auth SSO + permissao por servico | Integrado com NLAR |
| CRUD de contratos (cancelar/encerrar) | Implementado |
| Anexos de contratos | Implementado |
| Parcelas do ERP por contrato | Implementado |
| Anexos por parcela (comprovante, boleto, NF) | Implementado |
| Relatorio mensal + dashboard | Implementado |
| Chat de suporte e notificacoes globais | Integrado |
| Historico de contratos | Tabela criada, sem uso no app |
| Notificacoes de chamados (`/api/notificacoes`) | Stub |
| App `docs` | Template Turborepo, nao e o produto |

## Proximos passos

- Gravar e exibir o historico de alteracoes de contratos (`NS_controle_de_midia_contratos_historico`).
- Decidir se `/api/notificacoes` deve integrar notificacoes reais ou ser removido.
- Remover ou substituir o app `docs` de exemplo.
