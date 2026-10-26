const sql = require("mssql");
const path = require("path");

process.loadEnvFile(path.join(__dirname, ".env"));
// Configuração do banco de dados
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const conexao = new sql.ConnectionPool(config).connect();

module.exports = { sql, conexao };
