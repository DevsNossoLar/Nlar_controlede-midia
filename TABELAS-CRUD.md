# Tabelas e operações CRUD — Controle de Mídia

Referência das tabelas SQL Server usadas pela plataforma e das operações permitidas em cada uma.

**Banco:** SQL Server via Knex (`@repo/db`)  
**Regra geral:** apenas tabelas com prefixo `NS_controle_de_midia_` aceitam escrita. Demais tabelas são do ERP/legado e **somente SELECT**.

---

## Legenda

| Operação | Significado |
|----------|-------------|
| SELECT | Leitura (`select`, `first`, `count`, joins) |
| INSERT | Inclusão de registros |
| UPDATE | Alteração de registros |
| DELETE | Exclusão física de registros |

---

## Tabelas do módulo (escrita permitida)

### `NS_controle_de_midia_contratos`

Contratos de mídia (fornecedor, loja, valores, vigência, status, pagamento).

| Operação | Usado? | Onde / como |
|----------|--------|-------------|
| SELECT | Sim | `ContratosRepository.list`, `findById`; joins no relatório mensal |
| INSERT | Sim | `ContratosRepository.create` |
| UPDATE | Sim | `ContratosRepository.update`, `cancel`, `close` |
| DELETE | Não | Cancelamento/encerramento altera `status`, sem exclusão física |

**APIs:** `GET/POST /api/contratos`, `GET/PATCH /api/contratos/[id]`, `POST /api/contratos/[id]/cancelar`, `POST /api/contratos/[id]/encerrar`

**Repositório:** `packages/db/src/contratos/repository.ts`

---

### `NS_controle_de_midia_contrato_anexos`

Anexos do contrato (arquivo em base64: contrato, proposta, aditivo, etc.).

| Operação | Usado? | Onde / como |
|----------|--------|-------------|
| SELECT | Sim | `ContratoAnexosRepository.listByContratoId`, `findById` |
| INSERT | Sim | `ContratoAnexosRepository.create` |
| UPDATE | Não | — |
| DELETE | Sim | `ContratoAnexosRepository.delete` |

**APIs:** `GET/POST /api/contratos/[id]/anexos`, `GET/DELETE /api/contratos/[id]/anexos/[anexoId]`

**Repositório:** `packages/db/src/contratos/anexos/repository.ts`

---

### `NS_controle_de_midia_lancamento_financeiros`

Lançamento financeiro por parcela do ERP (vínculo contrato ↔ parcela aberta/paga).

| Operação | Usado? | Onde / como |
|----------|--------|-------------|
| SELECT | Sim | `LancamentoFinanceiroRepository.findByParcela`, `countAnexosByContrato` (join com anexos) |
| INSERT | Sim | `LancamentoFinanceiroRepository.findOrCreate` (cria só se não existir) |
| UPDATE | Não | — |
| DELETE | Não | — |

**APIs:** indiretamente em `GET/POST /api/contratos/[id]/parcelas/.../anexos` (cria lançamento ao anexar comprovante)

**Repositório:** `packages/db/src/contratos/lancamentos/repository.ts`

---

### `NS_controle_de_midia_lancamento_financeiro_anexos`

Comprovantes/anexos por parcela (boleto, comprovante, etc.).

| Operação | Usado? | Onde / como |
|----------|--------|-------------|
| SELECT | Sim | `LancamentoFinanceiroAnexosRepository.listByLancamentoId`, `findById` |
| INSERT | Sim | `LancamentoFinanceiroAnexosRepository.create` |
| UPDATE | Não | — |
| DELETE | Sim | `LancamentoFinanceiroAnexosRepository.delete` |

**APIs:** `GET/POST /api/contratos/[id]/parcelas/[parcelaRef]/anexos`, `GET/DELETE /api/contratos/[id]/parcelas/[parcelaRef]/anexos/[anexoId]`

**Repositório:** `packages/db/src/contratos/lancamentos/anexos-repository.ts`

---

### `NS_controle_de_midia_contratos_historico`

Auditoria de alterações em contratos (ação, JSON antes/depois).

| Operação | Usado? | Onde / como |
|----------|--------|-------------|
| SELECT | Não* | Tabela criada pelo script SQL; ainda sem repositório no app |
| INSERT | Não* | — |
| UPDATE | Não | — |
| DELETE | Não | — |

\* Script opcional: `packages/db/sql/008_create_NS_controle_de_midia_contratos_historico.sql`  
Constante definida em `packages/db/src/historico/constants.ts`, sem uso no código atual.

---

## Tabelas do ERP / legado (somente leitura)

Nunca usar INSERT, UPDATE, DELETE ou MERGE a partir desta plataforma.  
Lista canônica: `packages/db/src/shared/erp-readonly.ts`

### `fornecedores`

Busca e resolução de nomes de fornecedores.

| Operação | Usado? | Onde / como |
|----------|--------|-------------|
| SELECT | Sim | `buscarFornecedores`, `getFornecedoresPorCodigos` |
| INSERT | Não | — |
| UPDATE | Não | — |
| DELETE | Não | — |

**API:** `GET /api/fornecedores`  
**Arquivo:** `packages/db/src/contratos/fornecedores/get.ts`

---

### `Fornecedores`

Mesma finalidade que `fornecedores`; usada em joins do relatório e das parcelas (pode ser view/sinônimo no banco).

| Operação | Usado? | Onde / como |
|----------|--------|-------------|
| SELECT | Sim | Join em `getParcelasContrato`, `listParcelasAbertasPorMes`, `listParcelasPagasPorMes` |
| INSERT | Não | — |
| UPDATE | Não | — |
| DELETE | Não | — |

---

### `Parametro2`

Cadastro de lojas (`codLoja`, `empresa`).

| Operação | Usado? | Onde / como |
|----------|--------|-------------|
| SELECT | Sim | `buscarLojas`, `getLojasPorCodigos`; join no relatório mensal |
| INSERT | Não | — |
| UPDATE | Não | — |
| DELETE | Não | — |

**API:** `GET /api/lojas`  
**Arquivo:** `packages/db/src/contratos/loja/ge.ts`

---

### `CondicaoPagamento`

Condições de pagamento (à vista / à prazo).

| Operação | Usado? | Onde / como |
|----------|--------|-------------|
| SELECT | Sim | `getCondicoesPagamentoPrazo` (códigos 0 e 16, não descontinuadas) |
| INSERT | Não | — |
| UPDATE | Não | — |
| DELETE | Não | — |

**API:** `GET /api/contratos/condicoes-pagamento`  
**Arquivo:** `packages/db/src/contratos/pagamento/condicaoDePagamento.ts`

---

### `FormaPagamento`

Formas de pagamento para previsão de compra.

| Operação | Usado? | Onde / como |
|----------|--------|-------------|
| SELECT | Sim | `getFormasDePagamento` (`Usar_PrevisaoCompra = 1`, códigos fixos) |
| INSERT | Não | — |
| UPDATE | Não | — |
| DELETE | Não | — |

**API:** `GET /api/contratos/formas-pagamento`  
**Arquivo:** `packages/db/src/contratos/pagamento/formaDePagamento.ts`

---

### `contasapagar_tab`

Parcelas em aberto (contas a pagar).

| Operação | Usado? | Onde / como |
|----------|--------|-------------|
| SELECT | Sim | `getParcelasContrato` (union); `listParcelasAbertasPorMes` no relatório |
| INSERT | Não | — |
| UPDATE | Não | — |
| DELETE | Não | — |

**APIs:** `GET /api/contratos/[id]/parcelas`, `GET /api/relatorios/mensal` (parcelas abertas)  
**Arquivos:** `packages/db/src/contratos/pagamento/parcelas.ts`, `packages/db/src/contratos/relatorio/mensal.ts`

---

### `PrevisaoCompraBaixas`

Parcelas pagas/baixadas. Filtro de data no relatório: coluna `DataChegada`.

| Operação | Usado? | Onde / como |
|----------|--------|-------------|
| SELECT | Sim | `getParcelasContrato` (union); `listParcelasPagasPorMes` no relatório |
| INSERT | Não | — |
| UPDATE | Não | — |
| DELETE | Não | — |

**APIs:** `GET /api/contratos/[id]/parcelas`, `GET /api/relatorios/mensal` (parcelas pagas)

---

### `ENTRADAS`

Notas de entrada do ERP; usada apenas em join para parcelas abertas.

| Operação | Usado? | Onde / como |
|----------|--------|-------------|
| SELECT | Sim | `LEFT JOIN` em `getParcelasContrato` (`E.Cod_Entrada = CAP.COD_ENTRADA`) |
| INSERT | Não | — |
| UPDATE | Não | — |
| DELETE | Não | — |

**Arquivo:** `packages/db/src/contratos/pagamento/parcelas.ts`

---

## Resumo rápido

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|--------|:------:|:------:|:------:|:------:|
| `NS_controle_de_midia_contratos` | ✓ | ✓ | ✓ | — |
| `NS_controle_de_midia_contrato_anexos` | ✓ | ✓ | — | ✓ |
| `NS_controle_de_midia_lancamento_financeiros` | ✓ | ✓ | — | — |
| `NS_controle_de_midia_lancamento_financeiro_anexos` | ✓ | ✓ | — | ✓ |
| `NS_controle_de_midia_contratos_historico` | —* | —* | — | — |
| `fornecedores` / `Fornecedores` | ✓ | — | — | — |
| `Parametro2` | ✓ | — | — | — |
| `CondicaoPagamento` | ✓ | — | — | — |
| `FormaPagamento` | ✓ | — | — | — |
| `contasapagar_tab` | ✓ | — | — | — |
| `PrevisaoCompraBaixas` | ✓ | — | — | — |
| `ENTRADAS` | ✓ | — | — | — |

\* Tabela existe no banco (script opcional), mas o app ainda não a utiliza.

---

## Fora do SQL Server deste projeto

Autenticação, usuário e permissão **não** usam tabelas locais:

| Recurso | Serviço externo |
|---------|-----------------|
| Login / refresh / SSO | `NLAR_AUTH` |
| Perfil e permissão na plataforma | `NLAR_USER` |

Cookies: `access_token`, `refresh_token` (sem persistência em tabela neste repositório).

---

## Scripts de criação

Ordem recomendada para ambiente novo: ver `packages/db/sql/README.md`.
