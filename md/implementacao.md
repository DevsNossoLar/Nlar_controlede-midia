Preciso implementar o anexo de Nota Fiscal (NF) nas parcelas dos contratos deste projeto.

Contexto atual

Na listagem/detalhes de contratos existe o botão “Parcelas”. Ele abre uma tabela com:

- Situação;
- Valor;
- Vencimento;
- Anexos.

Cada parcela já possui um fluxo de anexos com upload, listagem, abertura/download e exclusão. Atualmente os tipos permitidos são:

- comprovante;
- boleto;
- outro.

Os arquivos são armazenados em Base64 na tabela:

dbo.NS_controle_de_midia_lancamento_financeiro_anexos

Objetivo

Adicionar “Nota Fiscal” como um novo tipo de anexo das parcelas, reaproveitando a estrutura existente e mantendo compatibilidade com os anexos atuais.

Implementação necessária

1. Banco de dados

Criar uma nova migration SQL, sem alterar migrations antigas já executadas.

A migration deve atualizar a constraint CHECK da coluna `tipo` na tabela:

dbo.NS_controle_de_midia_lancamento_financeiro_anexos

Os valores permitidos devem passar a ser:

- comprovante;
- boleto;
- nota_fiscal;
- outro.

A migration deve remover a constraint existente e recriá-la com segurança:

```sql
tipo IN ('comprovante', 'boleto', 'nota_fiscal', 'outro')