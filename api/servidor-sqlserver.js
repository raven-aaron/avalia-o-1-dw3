const express = require("express");
const { conexao } = require("./conexao");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});
app.get("/vacinas", async (req, res) => {
  try {
    const banco = await conexao;

    const resultado = await banco.request().query(
      "SELECT * FROM vacinas ORDER BY id DESC"
    );

    res.json(resultado.recordset);
  } catch (erro) {
    console.log(erro);
    res.status(500).json({ mensagem: "Erro ao buscar vacinas" });
  }
});
app.post("/vacinas", async (req, res) => {
  try {
    const dados = req.body;

    const campos = [
      "nome", "tipo", "especie", "fabricante",
      "descricao", "lote", "dataFabricacao",
      "validade", "quantidade", "dataEntrada",
      "responsavel", "fornecedor", "notaFiscal",
      "valorUnitario", "valorTotal", "temperatura",
      "localArmazenamento", "refrigeracao"
    ];

    const obrigatorios = [
      "nome", "tipo", "especie", "fabricante",
      "lote", "dataFabricacao", "validade",
      "quantidade", "dataEntrada", "responsavel",
      "fornecedor", "notaFiscal",
      "valorUnitario", "valorTotal"
    ];

    for (const campo of obrigatorios) {
      if (dados?.[campo] === undefined ||
          dados[campo] === null ||
          String(dados[campo]).trim() === "") {
        return res.status(400).json({
          mensagem: `Preencha o campo ${campo}.`
        });
      }
    }

    const banco = await conexao;
    const pedido = banco.request();

    for (const campo of campos) {
      pedido.input(campo, dados[campo] ?? null);
    }

    const resultado = await pedido.query(`
      INSERT INTO vacinas (${campos.join(", ")})
      OUTPUT INSERTED.id
      VALUES (${campos.map(campo => "@" + campo).join(", ")})
    `);

    res.status(201).json({
      mensagem: "Vacina cadastrada com sucesso!",
      id: resultado.recordset[0].id
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      mensagem: "Erro ao cadastrar vacina."
    });
  }
});
app.put("/vacinas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const dados = req.body || {};

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ mensagem: "ID inválido." });
    }

    const campos = [
      "nome", "tipo", "especie", "fabricante",
      "descricao", "lote", "dataFabricacao",
      "validade", "quantidade", "dataEntrada",
      "responsavel", "fornecedor", "notaFiscal",
      "valorUnitario", "valorTotal", "temperatura",
      "localArmazenamento", "refrigeracao"
    ];

    const alterar = campos.filter(campo => dados[campo] !== undefined);

    if (alterar.length === 0) {
      return res.status(400).json({ mensagem: "Nenhum dado informado." });
    }

    const banco = await conexao;
    const pedido = banco.request();

    pedido.input("id", id);

    for (const campo of alterar) {
      pedido.input(campo, dados[campo]);
    }

    const resultado = await pedido.query(`
      UPDATE vacinas
      SET ${alterar.map(campo => `${campo} = @${campo}`).join(", ")}
      OUTPUT INSERTED.*
      WHERE id = @id
    `);

    if (resultado.recordset.length === 0) {
      return res.status(404).json({ mensagem: "Vacina não encontrada." });
    }

    res.json({
      mensagem: "Vacina atualizada com sucesso!",
      vacina: resultado.recordset[0]
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: "Erro ao atualizar vacina." });
  }
});

app.delete("/vacinas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    const banco = await conexao;

    const resultado = await banco.request()
      .input("id", id)
      .query(`
        DELETE FROM vacinas
        OUTPUT DELETED.id
        WHERE id = @id
      `);

    if (resultado.recordset.length === 0) {
      return res.status(404).json({
        mensagem: "Vacina não encontrada."
      });
    }

    res.json({
      mensagem: "Vacina excluída com sucesso!"
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      mensagem: "Erro ao excluir vacina."
    });
  }
});
app.get("/vacinas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const banco = await conexao;

    const resultado = await banco.request()
      .input("id", id)
      .query("SELECT * FROM vacinas WHERE id = @id");

    if (resultado.recordset.length === 0) {
      return res.status(404).json({
        mensagem: "Vacina não encontrada."
      });
    }

    res.json(resultado.recordset[0]);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      mensagem: "Erro ao buscar vacina."
    });
  }
});
app.listen(3011, () => {
  console.log("API SQL Server rodando na porta 3011");
});
