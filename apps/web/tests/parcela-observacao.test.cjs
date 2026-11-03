const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

// Carrega o TypeScript com dependencias simuladas; nunca importa a conexao real.
function load(relativePath, dependencies = {}) {
  const filename = path.resolve(__dirname, "..", relativePath);
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    require(name) {
      assert.ok(name in dependencies, `Dependencia nao simulada: ${name}`);
      return dependencies[name];
    },
    Response, URL, URLSearchParams, SyntaxError,
  }, { filename });
  return exports;
}

const schema = load("app/lib/schemas/parcela-observacao.schema.ts");
const query = load("app/api/contratos/[id]/parcelas/_parcela-query.ts");

function setup({ authenticated = true, existing = true, matching = true } = {}) {
  const calls = [];
  const parcela = {
    origem: "ABERTO", erpChave: "ABERTO:10:1:2026-11-20",
    numPrevisao: 123, codLoja: 4, valorParcela: 150, vencimento: "2026-11-20",
  };
  const route = load("app/api/contratos/[id]/parcelas/observacao/route.ts", {
    "@repo/db": {
      ContratosRepository: class {
        async findById(id) {
          calls.push(["contrato", id]);
          return existing ? { numPrevisao: "123", codLoja: "4" } : null;
        }
      },
      LancamentoFinanceiroRepository: class {
        async findOrCreate(input) { calls.push(["create", input]); return { id: 90 }; }
        async updateObservacao(...args) { calls.push(["update", ...args]); }
      },
      async getParcelasContrato(...args) {
        calls.push(["parcelas", ...args]);
        return matching ? [parcela] : [];
      },
    },
    "@/utils/tokenAtivo": { async tokenAtivo() { return { valido: authenticated, codFunc: 7 }; } },
    "@/lib/schemas/parcela-observacao.schema": schema,
    "../../../_utils": { parseContratoIdParam: (id) => /^\d+$/.test(id) ? Number(id) : null },
    "../_parcela-query": query,
  });
  async function request(body, { id = "5", origem = parcela.origem, erpChave = parcela.erpChave, raw = false } = {}) {
    const params = new URLSearchParams({ origem, erpChave });
    return route.PATCH(new Request(`http://localhost/api/contratos/${id}/parcelas/observacao?${params}`, {
      method: "PATCH", body: raw ? body : JSON.stringify(body),
    }), { params: Promise.resolve({ id }) });
  }
  return { request, calls, parcela };
}

test("aceita texto, limpa espacos e permite remover a observacao", () => {
  assert.equal(schema.parseParcelaObservacao({ observacao: "  Conferir NF\ncom financeiro  " }), "Conferir NF\ncom financeiro");
  for (const observacao of [null, "", "   "]) {
    assert.equal(schema.parseParcelaObservacao({ observacao }), null);
  }
  assert.equal(schema.parseParcelaObservacao({ observacao: "a".repeat(2000) }).length, 2000);
});

test("rejeita payload ausente, tipos invalidos e texto acima do limite", () => {
  for (const body of [null, [], {}, { observacao: 123 }, { observacao: {} }, { observacao: "a".repeat(2001) }]) {
    assert.throws(() => schema.parseParcelaObservacao(body));
  }
});

test("sem autenticacao, nao consulta nem salva", async () => {
  const { request, calls } = setup({ authenticated: false });
  assert.equal((await request({ observacao: "Teste" })).status, 401);
  assert.equal(calls.length, 0);
});

test("referencia invalida e payload invalido nao chegam ao banco", async () => {
  for (const options of [{ id: "abc" }, { origem: "OUTRO" }, { erpChave: "" }]) {
    const { request, calls } = setup();
    assert.equal((await request({ observacao: "Teste" }, options)).status, 400);
    assert.equal(calls.length, 0);
  }
  for (const body of [{}, { observacao: 1 }, { observacao: "x".repeat(2001) }]) {
    const { request, calls } = setup();
    assert.equal((await request(body)).status, 400);
    assert.equal(calls.length, 0);
  }
  const { request, calls } = setup();
  assert.equal((await request("{", { raw: true })).status, 400);
  assert.equal(calls.length, 0);
});

test("contrato ou parcela inexistente nao permite gravacao", async () => {
  for (const options of [{ existing: false }, { matching: false }]) {
    const { request, calls } = setup(options);
    assert.equal((await request({ observacao: "Teste" })).status, 404);
    assert.equal(calls.filter(([name]) => name === "create" || name === "update").length, 0);
  }
});

test("salva na parcela correta e usa valores do ERP, ignorando valores enviados pelo cliente", async () => {
  const { request, calls, parcela } = setup();
  const response = await request({ observacao: "  Conferido  ", valor: 999, codLoja: 999 });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { observacao: "Conferido" });
  const input = calls.find(([name]) => name === "create")[1];
  assert.equal(input.contratoId, 5);
  assert.equal(input.erpChave, parcela.erpChave);
  assert.equal(input.valor, parcela.valorParcela);
  assert.equal(input.codLoja, "4");
  assert.equal(input.criadoPor, "7");
  assert.deepEqual(calls.find(([name]) => name === "update"), ["update", 5, 90, "Conferido"]);
});

test("apagar texto salva null", async () => {
  const { request, calls } = setup();
  assert.equal((await request({ observacao: "   " })).status, 200);
  assert.deepEqual(calls.find(([name]) => name === "update"), ["update", 5, 90, null]);
});

test("repositorio grava somente na tabela do modulo, restringindo contrato e lancamento", async () => {
  const calls = [];
  const table = "NS_controle_de_midia_lancamento_financeiros";
  const { LancamentoFinanceiroRepository } = load("../../packages/db/src/contratos/lancamentos/repository.ts", {
    "../../conexao/config": {
      db(name) {
        calls.push(["table", name]);
        return {
          where(filter) {
            calls.push(["where", JSON.parse(JSON.stringify(filter))]);
            return this;
          },
          async update(values) {
            calls.push(["update", JSON.parse(JSON.stringify(values))]);
            return 1;
          },
        };
      },
    },
    "../../conexao/dbConnection": { async dbConnection() {} },
    "../constants": { LANCAMENTO_FINANCEIROS_TABLE: table },
    "../id": { parseContratoId: Number },
  });
  const repository = new LancamentoFinanceiroRepository();
  await repository.updateObservacao(5, 90, "  Revisar  ");
  assert.deepEqual(calls[0], ["table", table]);
  assert.deepEqual(calls[1], ["where", { id: 90, contrato_id: 5 }]);
  assert.equal(calls[2][1].observacao, "Revisar");
  assert.ok(calls[2][1].updated_at);
  await repository.updateObservacao(5, 90, "");
  assert.equal(calls[5][1].observacao, null);
  const previousCalls = calls.length;
  await assert.rejects(() => repository.updateObservacao(5, 90, "a".repeat(2001)));
  assert.equal(calls.length, previousCalls);
});
