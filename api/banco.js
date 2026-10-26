const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const pastaDados = path.join(__dirname, "dados");
fs.mkdirSync(pastaDados, { recursive: true });

const arquivoBanco = path.join(pastaDados, "vacinas.db");
const bancoNovo = !fs.existsSync(arquivoBanco);
const banco = new DatabaseSync(arquivoBanco);

banco.exec(`
  CREATE TABLE IF NOT EXISTS vacinas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    especie TEXT NOT NULL,
    fabricante TEXT NOT NULL,
    descricao TEXT NOT NULL DEFAULT '',
    lote TEXT NOT NULL,
    dataFabricacao TEXT NOT NULL,
    validade TEXT NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade >= 0),
    dataEntrada TEXT NOT NULL,
    responsavel TEXT NOT NULL,
    fornecedor TEXT NOT NULL,
    notaFiscal TEXT NOT NULL,
    valorUnitario REAL NOT NULL CHECK (valorUnitario >= 0),
    valorTotal REAL NOT NULL CHECK (valorTotal >= 0),
    temperatura TEXT NOT NULL DEFAULT '',
    localArmazenamento TEXT NOT NULL DEFAULT '',
    refrigeracao INTEGER NOT NULL DEFAULT 0
  );
`);

// Os dados de exemplo são importados somente na criação do banco.
if (bancoNovo) {
  const arquivoExemplos = path.join(__dirname, "..", "src", "data", "vacinas.json");
  const exemplos = JSON.parse(fs.readFileSync(arquivoExemplos, "utf8"));
  const inserir = banco.prepare(`
    INSERT INTO vacinas (
      id, nome, tipo, especie, fabricante, descricao, lote,
      dataFabricacao, validade, quantidade, dataEntrada,
      responsavel, fornecedor, notaFiscal, valorUnitario,
      valorTotal, temperatura, localArmazenamento, refrigeracao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  banco.exec("BEGIN");
  try {
    for (const vacina of exemplos) {
      inserir.run(
        vacina.id, vacina.nome, vacina.tipo, vacina.especie,
        vacina.fabricante, vacina.descricao || "", vacina.lote,
        vacina.dataFabricacao, vacina.validade, vacina.quantidade,
        vacina.dataEntrada, vacina.responsavel, vacina.fornecedor,
        vacina.notaFiscal, vacina.valorUnitario, vacina.valorTotal,
        vacina.temperatura || "", vacina.localArmazenamento || "",
        vacina.refrigeracao ? 1 : 0
      );
    }
    banco.exec("COMMIT");
  } catch (erro) {
    banco.exec("ROLLBACK");
    throw erro;
  }
}

module.exports = banco;
