const express = require("express");   
const banco = require("./banco");

const app = express();
const porta = 3010;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

const campos = [
  "nome", "tipo", "especie", "fabricante", "descricao", "lote",
  "dataFabricacao", "validade", "quantidade", "dataEntrada",
  "responsavel", "fornecedor", "notaFiscal", "valorUnitario",
  "valorTotal", "temperatura", "localArmazenamento", "refrigeracao"
];

function prepararVacina(dados) {
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    return { erro: "Dados da vacina inválidos." };
  }

  const obrigatorios = [
    "nome", "tipo", "especie", "fabricante", "lote",
    "dataFabricacao", "validade", "dataEntrada",
    "responsavel", "fornecedor", "notaFiscal"
  ];

  for (const campo of obrigatorios) {
    if (!String(dados[campo] ?? "").trim()) {
      return { erro: `Preencha o campo ${campo}.` };
    }
  }

  const quantidade = Number(dados.quantidade);
  const valorUnitario = Number(dados.valorUnitario);
  const valorTotal = Number(dados.valorTotal);

  if (!Number.isInteger(quantidade) || quantidade < 1) {
    return { erro: "A quantidade deve ser um número inteiro maior que zero." };
  }
  if (!Number.isFinite(valorUnitario) || valorUnitario < 0 ||
      !Number.isFinite(valorTotal) || valorTotal < 0 ||
      dados.valorUnitario === "" || dados.valorTotal === "") {
    return { erro: "Os valores devem ser números maiores ou iguais a zero." };
  }

  const camposData = ["dataFabricacao", "validade", "dataEntrada"];
  for (const campo of camposData) {
    const data = String(dados[campo]);
    const formato = /^\d{4}-\d{2}-\d{2}$/.test(data);
    const dataValida = formato && !Number.isNaN(new Date(`${data}T12:00:00`).getTime());
    if (!dataValida) {
      return { erro: `Informe uma data válida em ${campo}.` };
    }
  }
  if (dados.validade < dados.dataFabricacao) {
    return { erro: "A validade não pode ser anterior à fabricação." };
  }

  const vacina = {
    nome: String(dados.nome).trim(),
    tipo: String(dados.tipo).trim(),
    especie: String(dados.especie).trim(),
    fabricante: String(dados.fabricante).trim(),
    descricao: String(dados.descricao || "").trim(),
    lote: String(dados.lote).trim(),
    dataFabricacao: dados.dataFabricacao,
    validade: dados.validade,
    quantidade,
    dataEntrada: dados.dataEntrada,
    responsavel: String(dados.responsavel).trim(),
    fornecedor: String(dados.fornecedor).trim(),
    notaFiscal: String(dados.notaFiscal).trim(),
    valorUnitario,
    valorTotal,
    temperatura: String(dados.temperatura || "").trim(),
    localArmazenamento: String(dados.localArmazenamento || "").trim(),
    refrigeracao: dados.refrigeracao ? 1 : 0
  };

  return { vacina };
}

function procurarVacina(id) {
  if (!Number.isSafeInteger(id) || id < 1) {
    return null;
  }
  return banco.prepare("SELECT * FROM vacinas WHERE id = ?").get(id);
}

app.get("/vacinas", (req, res) => {
  const vacinas = banco.prepare("SELECT * FROM vacinas ORDER BY id DESC").all();
  res.json(vacinas);
});

app.get("/qtdvacinas", (req, res) => {
  const resultado = banco.prepare("SELECT COUNT(*) AS qtd FROM vacinas").get();
  res.json(resultado);
});

app.get("/vacinas/:id", (req, res) => {
  const vacina = procurarVacina(Number(req.params.id));
  if (!vacina) {
    return res.status(404).json({ mensagem: "Vacina não encontrada." });
  }
  res.json(vacina);
});

app.post("/vacinas", (req, res) => {
  const resultado = prepararVacina(req.body);
  if (resultado.erro) {
    return res.status(400).json({ mensagem: resultado.erro });
  }

  const vacina = resultado.vacina;
  const inserir = banco.prepare(`
    INSERT INTO vacinas (${campos.join(", ")})
    VALUES (${campos.map(() => "?").join(", ")})
  `);
  const salvo = inserir.run(...campos.map(campo => vacina[campo]));
  res.status(201).json(procurarVacina(Number(salvo.lastInsertRowid)));
});

app.put("/vacinas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!procurarVacina(id)) {
    return res.status(404).json({ mensagem: "Vacina não encontrada." });
  }
  const resultado = prepararVacina(req.body);
  if (resultado.erro) {
    return res.status(400).json({ mensagem: resultado.erro });
  }

  const atualizar = banco.prepare(`
    UPDATE vacinas
    SET ${campos.map(campo => `${campo} = ?`).join(", ")}
    WHERE id = ?
  `);
  atualizar.run(...campos.map(campo => resultado.vacina[campo]), id);
  res.json(procurarVacina(id));
});

app.delete("/vacinas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ mensagem: "Identificador inválido." });
  }
  const excluir = banco.prepare("DELETE FROM vacinas WHERE id = ?");
  const resultado = excluir.run(id);
  if (resultado.changes === 0) {
    return res.status(404).json({ mensagem: "Vacina não encontrada." });
  }
  res.json({ mensagem: "Vacina excluída com sucesso." });
});

app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(erro.status || 500).json({ mensagem: "Erro no servidor." });
});

app.listen(porta, () => {
  console.log(`API de vacinas: http://localhost:${porta}`);
});
