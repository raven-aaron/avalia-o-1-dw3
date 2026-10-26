const assert = require("node:assert/strict");

const url = "http://localhost:3010/vacinas";

async function enviar(endereco, metodo, dados) {
  const resposta = await fetch(endereco, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: dados ? JSON.stringify(dados) : undefined,
  });
  return { status: resposta.status, dados: await resposta.json() };
}

async function testar() {
  const dados = {
    nome: "Vacina de teste", tipo: "V8", especie: "cao",
    fabricante: "Laboratório Teste", descricao: "Teste da API",
    lote: "TESTE-001", dataFabricacao: "2026-01-10",
    validade: "2027-01-10", quantidade: 12,
    dataEntrada: "2026-02-01", responsavel: "Equipe de Testes",
    fornecedor: "Fornecedor Teste", notaFiscal: "NF-123",
    valorUnitario: 10, valorTotal: 120,
    temperatura: "2°C a 8°C", localArmazenamento: "Geladeira 1",
    refrigeracao: true,
  };

  let id;
  try {
    let resposta = await enviar(url, "GET");
    assert.equal(resposta.status, 200);
    assert.ok(Array.isArray(resposta.dados));
    console.log("GET /vacinas: OK");

    resposta = await enviar(url, "POST", dados);
    assert.equal(resposta.status, 201);
    id = resposta.dados.id;
    console.log("POST /vacinas: OK, id", id);

    resposta = await enviar(`${url}/${id}`, "GET");
    assert.equal(resposta.dados.nome, dados.nome);
    console.log("GET /vacinas/:id: OK");

    resposta = await enviar(`${url}/${id}`, "PUT", { ...dados, nome: "Vacina editada" });
    assert.equal(resposta.dados.nome, "Vacina editada");
    console.log("PUT /vacinas/:id: OK");

    resposta = await enviar(`${url}/${id}`, "DELETE");
    assert.equal(resposta.status, 200);
    id = undefined;
    console.log("DELETE /vacinas/:id: OK");
    console.log("Todos os testes da API passaram.");
  } finally {
    if (id) {
      await enviar(`${url}/${id}`, "DELETE");
    }
  }
}

testar().catch((erro) => {
  console.error("Erro no teste:", erro.message);
  process.exitCode = 1;
});
