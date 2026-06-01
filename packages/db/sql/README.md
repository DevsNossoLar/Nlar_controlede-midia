# Scripts SQL - Controle de Midia

## Escopo atual

O banco do modulo mantem contratos, anexos de contratos, lancamentos financeiros por parcela (comprovantes), e historico opcional de contratos.

## Padrao de identificadores

| Uso | Tipo SQL | Exemplo |
|-----|----------|---------|
| Chave primaria (`id`) | `INT IDENTITY(1,1) NOT NULL PRIMARY KEY` | 1, 2, 3 |
| FK para outra tabela do modulo | `INT NOT NULL` + FK | `contrato_id` |
| Codigo de fornecedor / loja | `NVARCHAR(36)` | `codFor`, `codLoja` |
| Usuario que criou | `NVARCHAR(36) NULL` | `created_by` |

Nao usar `UNIQUEIDENTIFIER` para PK ou FK entre tabelas deste modulo.

## Tabelas do ERP (somente leitura)

Tabelas que **nao** comecam com `NS_controle_de_midia_` pertencem ao ERP/legado compartilhado.
Neste modulo, **apenas SELECT** e permitido nelas — nunca INSERT, UPDATE, DELETE ou MERGE.

Exemplos usados pelo app:

| Tabela | Uso |
|--------|-----|
| `contasapagar_tab` | Parcelas em aberto (relatorio mensal, parcelas por contrato) |
| `PrevisaoCompraBaixas` | Parcelas pagas (relatorio mensal filtra por `DataChegada`) |
| `Parametro2` | Nome das lojas |
| `Fornecedores` / `fornecedores` | Busca de fornecedores |
| `CondicaoPagamento` / `FormaPagamento` | Opcoes de pagamento |

Escrita permitida somente em `NS_controle_de_midia_*` (contratos, anexos, lancamentos financeiros, historico).

## Ambiente novo

1. `003_create_NS_controle_de_midia_contratos.sql`
2. `004_create_NS_controle_de_midia_contrato_anexos.sql`
3. `005_alter_contratos_tipo_remove_categoria.sql`
4. `009_alter_contratos_add_pagamento.sql`
5. `010_alter_contratos_add_num_previsao_cotacao.sql` (pagamento + num previsao/cotacao; idempotente se 009 ja foi aplicado)
6. `011_recreate_lancamento_financeiro_parcelas.sql` (lancamentos por parcela + anexos comprovantes)
7. `008_create_NS_controle_de_midia_contratos_historico.sql` (opcional)

## Banco legado com GUID em contratos

1. `006_alter_contratos_id_to_int_identity.sql`
2. `004_create_NS_controle_de_midia_contrato_anexos.sql`
3. `005_alter_contratos_tipo_remove_categoria.sql`
4. `009_alter_contratos_add_pagamento.sql`
5. `010_alter_contratos_add_num_previsao_cotacao.sql` (pagamento + num previsao/cotacao; idempotente se 009 ja foi aplicado)
6. `011_recreate_lancamento_financeiro_parcelas.sql` (lancamentos por parcela + anexos comprovantes)
7. `008_create_NS_controle_de_midia_contratos_historico.sql` (opcional)
