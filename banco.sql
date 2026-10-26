IF DB_ID('cadastro_animais') IS NULL
    CREATE DATABASE cadastro_animais;
GO

USE cadastro_animais;
GO

IF OBJECT_ID('dbo.vacinas', 'U') IS NULL
BEGIN
    CREATE TABLE vacinas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome NVARCHAR(150) NOT NULL,
        tipo NVARCHAR(50) NOT NULL,
        especie NVARCHAR(20) NOT NULL,
        fabricante NVARCHAR(120) NOT NULL,
        descricao NVARCHAR(MAX),
        lote NVARCHAR(80) NOT NULL,
        dataFabricacao DATE NOT NULL,
        validade DATE NOT NULL,
        quantidade INT NOT NULL,
        dataEntrada DATE NOT NULL,
        responsavel NVARCHAR(120) NOT NULL,
        fornecedor NVARCHAR(120) NOT NULL,
        notaFiscal NVARCHAR(60) NOT NULL,
        valorUnitario DECIMAL(12,2) NOT NULL,
        valorTotal DECIMAL(12,2) NOT NULL,
        temperatura NVARCHAR(50),
        localArmazenamento NVARCHAR(100),
        refrigeracao BIT DEFAULT 0
    );
END;
GO
