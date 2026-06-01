# Prompt — Implementar Frontend do Módulo de Contratos no `apps/web`

Você é um desenvolvedor sênior especialista em **Next.js**, **TypeScript**, **React**, **POO**, **arquitetura frontend**, **App Router**, **integração com APIs**, **monorepo** e **boas práticas de organização de código**.

Preciso que você implemente/incremente a interface web do módulo de **Contratos** dentro de:

```txt
apps/web
```

O módulo de domínio/banco já existe em:

```txt
packages/db/src/contratos
```

Neste momento, o foco é **somente Contratos no frontend**.

Não implemente ainda o fluxo completo de anexos.

Apenas deixe a estrutura preparada para anexos futuramente, pois os anexos serão usados depois em:

```txt
Contratos
```

Por enquanto, a entrega precisa ser a interface funcional de **Contratos**.

---

# Objetivo

Criar/incrementar a interface de Contratos no `apps/web`, permitindo ao usuário:

1. Listar contratos;
2. Buscar contratos;
3. Filtrar contratos;
4. Criar contrato;
5. Editar contrato;
6. Visualizar detalhes do contrato;
7. Alterar status, caso exista essa regra;
8. Cancelar contrato, caso exista essa regra;
9. Encerrar contrato, caso exista essa regra;
10. Visualizar dados relacionados de fornecedor;
11. Visualizar dados relacionados de loja;
12. Usar autenticação já existente;
13. Usar o padrão visual e arquitetural já existente no `apps/web`.

---

# Regra importante

Antes de codar, analise o projeto existente.

Verifique:

```txt
apps/web
packages/db/src/contratos
packages/db/src/fornecedores
packages/db/src/loja
```

Não crie uma arquitetura nova se já existir padrão no projeto.

Use como base o que já existe em:

```txt
apps/web/src/app
apps/web/src/app/api
apps/web/src/components
apps/web/src/lib
apps/web/src/services
apps/web/src/hooks
apps/web/src/styles
apps/web/src/globals.css
```

Caso o projeto use nomes ou caminhos diferentes, adapte ao padrão existente.

---

# Escopo deste momento

## Deve implementar agora

```txt
Frontend de contratos
Listagem
Filtros
Busca
Formulário de criação
Formulário de edição
Página de detalhes
Integração com fornecedor
Integração com loja
Integração com autenticação
Integração com APIs existentes
Tratamento de loading
Tratamento de erro
Feedback visual
```

## Não deve implementar agora

```txt
Upload de anexos
Listagem de anexos
Download de anexos
Remoção de anexos
Base64 de arquivos
```

## Pode preparar para depois

Pode deixar pontos de extensão/componentes placeholders simples, sem lógica real de anexo, por exemplo:

```txt
contratos/_components/contrato-anexos-placeholder.tsx
```

Mas não deve implementar upload, conversão base64 ou persistência de anexos agora.

Apenas deixe a arquitetura preparada para receber anexos futuramente.

---

# Estrutura de domínio existente

O backend/domínio do contrato está em:

```txt
packages/db/src/contratos
```

Analise os arquivos:

```txt
constants.ts
contrato.class.ts
repository.ts
type.ts
index.ts
```

Use os tipos e regras existentes como referência.

Não duplique regra de negócio no frontend.

O frontend deve validar dados de formulário, mas a regra principal de contrato deve continuar no backend/domínio.

---

# Integração com Fornecedores

O contrato possui relacionamento com fornecedor através de:

```txt
codFor
```

O `codFor` deve vir do módulo já existente em:

```txt
packages/db/src/fornecedores
```

Já existe uma consulta que busca fornecedores.

Use essa consulta/API/padrão já existente.

A interface de contratos deve permitir selecionar fornecedor buscando por:

```txt
codFor
nomeFor
nomeFantasia
```

O campo de busca de fornecedor deve funcionar assim:

```txt
Se o usuário digitar um código, buscar por codFor.
Se o usuário digitar texto, buscar por nomeFor ou nomeFantasia.
```

Na UI, exiba o fornecedor de forma amigável.

Exemplo:

```txt
123 - Fornecedor ABC - Nome Fantasia ABC
```

O valor salvo no contrato deve ser:

```txt
codFor
```

Não crie um novo módulo de fornecedores.

Apenas reaproveite e incremente a busca no frontend/API, caso necessário.

---

# Integração com Loja

O contrato possui relacionamento com loja através de:

```txt
codLoja
```

O `codLoja` deve vir do módulo já existente em:

```txt
packages/db/src/loja
```

Nesse módulo já existe:

```txt
getLoja
```

Use o `getLoja` já existente.

A interface de contratos deve permitir selecionar loja buscando por:

```txt
codLoja
empresa
```

O campo de busca de loja deve funcionar assim:

```txt
Se o usuário digitar um código, buscar por codLoja.
Se o usuário digitar texto, buscar por empresa.
```

Na UI, exiba a loja de forma amigável.

Exemplo:

```txt
1 - Nossa Loja Matriz
```

O valor salvo no contrato deve ser:

```txt
codLoja
```

Não crie um novo módulo de loja.

Apenas reaproveite o `getLoja` e incremente filtros no frontend/API, caso necessário.

---

# Autenticação

Antes de implementar, analise como a autenticação já funciona no `apps/web`.

Procure por:

```txt
middleware
session
cookies
tokens
auth
login
layout privado
rotas protegidas
fetch autenticado
usuário logado
permissões
```

Use exatamente o padrão já existente.

Não implemente outro sistema de autenticação.

As telas de contratos devem respeitar o fluxo atual de autenticação.

Se o projeto já usa layout privado, coloque contratos dentro do layout privado.

Se as APIs exigem token, use o helper/fetcher já existente.

Se existe usuário logado disponível, use-o para campos de auditoria quando o backend/API aceitar.

---

# APIs

Antes de criar qualquer API nova, procure APIs existentes em:

```txt
apps/web/src/app/api
apps/web/src/services
apps/web/src/lib
apps/web/src/actions
```

Use as APIs já existentes como exemplo.

Caso ainda não existam APIs para contratos, crie seguindo o padrão atual do projeto.

Não crie endpoints duplicados.

Endpoints esperados para Contratos, caso ainda não existam:

```txt
GET    /api/contratos
POST   /api/contratos
GET    /api/contratos/[id]
PUT    /api/contratos/[id]
PATCH  /api/contratos/[id]/status
```

Caso exista no domínio regra para cancelar/encerrar contrato, pode criar rotas específicas ou usar status conforme o padrão do projeto:

```txt
PATCH /api/contratos/[id]/cancelar
PATCH /api/contratos/[id]/encerrar
```

Mas só implemente se fizer sentido com o que já existe em `packages/db/src/contratos`.

---

# APIs de apoio para seleção

Caso ainda não existam APIs para busca de fornecedores e lojas no `apps/web`, crie seguindo o padrão atual.

## Fornecedores

A API de busca de fornecedores deve reaproveitar:

```txt
packages/db/src/fornecedores
```

Filtros esperados:

```txt
codFor
nomeFor
nomeFantasia
q
```

Exemplo:

```txt
GET /api/fornecedores?q=abc
GET /api/fornecedores?codFor=123
GET /api/fornecedores?nomeFor=Fornecedor
GET /api/fornecedores?nomeFantasia=ABC
```

## Lojas

A API de busca de lojas deve reaproveitar:

```txt
packages/db/src/loja/getLoja
```

Filtros esperados:

```txt
codLoja
empresa
q
```

Exemplo:

```txt
GET /api/lojas?q=matriz
GET /api/lojas?codLoja=1
GET /api/lojas?empresa=Nossa Loja
```

---

# Organização do frontend

Siga as melhores práticas do Next.js App Router.

Componentes, hooks, schemas, services e utils que forem usados apenas na rota de contratos devem ficar próximos da rota usando `_`.

Estrutura sugerida:

```txt
apps/web/src/app/(private)/contratos/
  page.tsx
  novo/
    page.tsx
  [id]/
    page.tsx
    editar/
      page.tsx

  _components/
    contratos-table.tsx
    contrato-form.tsx
    contrato-filters.tsx
    contrato-status-badge.tsx
    contrato-actions.tsx
    contrato-details-card.tsx
    fornecedor-select.tsx
    loja-select.tsx
    contrato-anexos-placeholder.tsx

  _hooks/
    use-contratos.ts
    use-contrato.ts
    use-contrato-form.ts
    use-fornecedor-search.ts
    use-loja-search.ts

  _schemas/
    contrato.schema.ts

  _services/
    contrato.service.ts
    fornecedor.service.ts
    loja.service.ts

  _types/
    contrato.type.ts
    fornecedor.type.ts
    loja.type.ts

  _utils/
    contrato.mapper.ts
    contrato-format.ts
```

Essa estrutura é uma referência.

Se o projeto já usa outro padrão, siga o padrão existente.

---

# Regra sobre componentes globais

Não coloque componentes específicos de contratos em uma pasta global.

Componentes específicos devem ficar próximos da rota:

```txt
contratos/_components
```

Só coloque em componentes globais se for algo reutilizável em outros módulos.

Exemplo de componente que poderia ser global apenas se fizer sentido:

```txt
AsyncSelect
StatusBadge
DataTable
ConfirmDialog
```

Mesmo assim, primeiro verifique se já existe algo parecido no projeto.

---

# Páginas esperadas

## Listagem de contratos

Criar ou incrementar:

```txt
/contratos
```

A página deve conter:

```txt
Título
Descrição curta
Botão Novo Contrato
Tabela de contratos
Busca geral
Filtro por status
Filtro por fornecedor
Filtro por loja
Filtro por período/data
Ações por linha
Loading
Estado vazio
Tratamento de erro
Paginação, caso o padrão do projeto já tenha
```

A busca geral deve permitir pesquisar por dados relevantes do contrato, como:

```txt
número do contrato
descrição
fornecedor
loja
status
```

Se o backend/API aceitar apenas alguns filtros, implemente os filtros disponíveis e deixe o código preparado para expansão.

---

## Formulário de novo contrato

Criar ou incrementar:

```txt
/contratos/novo
```

O formulário deve conter os campos definidos no contrato.

Campos esperados, respeitando o que existe no domínio:

```txt
codFor
codLoja
numeroContrato
descricao
dataInicio
dataFim
valor
status
observacao
```

O formulário deve ter:

```txt
validação
loading no submit
feedback de sucesso
feedback de erro
botão salvar
botão cancelar/voltar
```

Fornecedor e loja devem ser selecionados usando busca.

---

## Formulário de edição

Criar ou incrementar:

```txt
/contratos/[id]/editar
```

O formulário deve:

```txt
buscar os dados atuais do contrato
preencher os campos
permitir alteração
validar dados
salvar alterações
exibir loading
exibir feedback
voltar para detalhe ou listagem após salvar
```

---

## Detalhes do contrato

Criar ou incrementar:

```txt
/contratos/[id]
```

A tela deve exibir:

```txt
dados principais
fornecedor relacionado
loja relacionada
status
datas
valor
observação
auditoria, caso exista
ações disponíveis
```

Ações possíveis:

```txt
editar
voltar
cancelar contrato, se existir regra/API
encerrar contrato, se existir regra/API
alterar status, se existir regra/API
```

---

# Validação

Use o padrão já existente no projeto.

Se o projeto usa `zod`, use `zod`.

Se usa outra solução, siga o padrão existente.

Validações mínimas:

```txt
Fornecedor obrigatório
Loja obrigatória
Número do contrato obrigatório
Descrição obrigatória
Data de início obrigatória
Data final não pode ser menor que data inicial
Valor não pode ser negativo
Status válido
```

Não coloque regra de domínio complexa no frontend.

A validação do frontend é apenas para UX.

---

# Tipagem

Use TypeScript fortemente tipado.

Evite `any`.

Crie tipos para:

```txt
Contrato
ContratoStatus
ContratoListItem
ContratoFormValues
ContratoFilters
FornecedorOption
LojaOption
ApiResponse
PaginatedResponse, se existir paginação
```

Se já existirem tipos exportados de `packages/db/src/contratos`, reaproveite quando fizer sentido.

Caso exista diferença entre snake_case da API/banco e camelCase do frontend, use mappers.

---

# Services e chamadas HTTP

Não faça `fetch` espalhado diretamente nos componentes.

Use o padrão já existente.

Se o projeto já tiver um fetcher/lib HTTP, use-o.

Caso contrário, crie service próximo da rota:

```txt
contratos/_services/contrato.service.ts
```

Exemplo de responsabilidades:

```txt
listarContratos
buscarContratoPorId
criarContrato
atualizarContrato
alterarStatusContrato
cancelarContrato
encerrarContrato
```

Para fornecedores:

```txt
buscarFornecedores
```

Para lojas:

```txt
buscarLojas
```

---

# Hooks

Use hooks para estado e orquestração no client quando necessário.

Exemplos:

```txt
useContratos
useContrato
useContratoForm
useFornecedorSearch
useLojaSearch
```

Não crie hooks desnecessários se server components/actions resolverem melhor conforme o padrão do projeto.

Siga o padrão atual do `apps/web`.

---

# UI e UX

Use o tema e design system existentes.

Verifique:

```txt
globals.css
tailwind
components/ui
button
input
select
dialog
table
badge
toast
sidebar
layout
```

A UI deve ser moderna, consistente e funcional.

Não crie um visual diferente do restante do sistema.

A tela precisa ter:

```txt
loading
estado vazio
erro
feedback de sucesso
confirmação para ações críticas
responsividade
acessibilidade básica
```

Ações críticas como cancelar ou encerrar contrato devem pedir confirmação.

---

# Preparação futura para anexos

Não implemente anexos agora.

Mas deixe claro no código que a tela de detalhes do contrato poderá receber uma seção de anexos depois.

Pode criar apenas um placeholder visual simples, se fizer sentido:

```txt
contratos/_components/contrato-anexos-placeholder.tsx
```

Esse placeholder deve apenas informar algo como:

```txt
Anexos serão implementados em uma próxima etapa.
```

Não deve ter:

```txt
input file
conversão base64
upload
download
delete
API de anexos
```

Importante: futuramente os anexos serão reaproveitados em:

```txt
Contratos
```

Então, quando anexos forem implementados depois, devem ser pensados como componente/fluxo reutilizável. Mas isso fica fora deste escopo inicial.

---

# Histórico

Se já existir histórico no módulo de contratos, pode implementar a visualização.

Se ainda não existir API ou estrutura funcional para histórico, não force agora.

Pode deixar preparado para etapa futura.

Prioridade deste momento:

```txt
Contrato funcional primeiro.
Anexos e histórico depois, se ainda não estiverem prontos.
```

---

# Ordem de execução

Siga esta ordem:

1. Analise `packages/db/src/contratos`;
2. Analise `packages/db/src/fornecedores`;
3. Analise `packages/db/src/loja`;
4. Analise `apps/web`;
5. Entenda o padrão de rotas, APIs, autenticação, services e UI;
6. Identifique se já existem APIs de contratos, fornecedores e lojas;
7. Planeje a implementação sem criar arquitetura paralela;
8. Implemente listagem de contratos;
9. Implemente filtros e busca;
10. Implemente seleção de fornecedor por `codFor`, `nomeFor` ou `nomeFantasia`;
11. Implemente seleção de loja por `codLoja` ou `empresa`;
12. Implemente criação de contrato;
13. Implemente edição de contrato;
14. Implemente detalhes do contrato;
15. Implemente ações de status/cancelar/encerrar somente se já houver suporte coerente;
16. Integre autenticação usando o padrão existente;
17. Trate loading, erro e feedback;
18. Revise tipos e organização dos arquivos;
19. Rode lint/typecheck/build se existirem scripts;
20. Informe arquivos criados/alterados e como testar.

---

# Cuidados obrigatórios

Não faça:

```txt
Não implemente anexos agora
Não crie upload base64 agora
Não crie módulo novo de fornecedor
Não crie módulo novo de loja
Não duplique APIs existentes
Não crie autenticação nova
Não ignore padrões existentes do apps/web
Não coloque componente específico de contrato em pasta global
Não misture regra de negócio complexa no componente React
Não espalhe fetch diretamente em vários componentes
Não use any sem necessidade
Não altere o domínio em packages/db sem necessidade real
Não quebre rotas existentes
```

Faça:

```txt
Use o padrão existente
Use componentes próximos da rota com _
Use services/hooks/schemas próximos da rota quando forem específicos
Use fornecedor vindo de packages/db/src/fornecedores
Use loja vindo de packages/db/src/loja/getLoja
Busque fornecedor por codFor, nomeFor ou nomeFantasia
Busque loja por codLoja ou empresa
Mantenha contrato funcional antes de anexos
Deixe preparado para anexos depois
Use autenticação já existente
Use design system/tema atual
```

---

# Resultado esperado

Quero uma implementação real no frontend de contratos dentro de `apps/web`.

O contrato deve estar funcional antes de avançarmos para anexos.

Ao final, informe:

```txt
Arquivos criados
Arquivos alterados
Rotas criadas
APIs usadas/criadas
Como testar listagem
Como testar criação
Como testar edição
Como testar detalhes
Pontos deixados preparados para anexos futuramente
```

Priorize consistência com o projeto atual, código limpo, tipagem forte e boa organização.
