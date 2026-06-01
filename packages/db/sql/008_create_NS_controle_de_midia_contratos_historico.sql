IF OBJECT_ID('dbo.NS_controle_de_midia_contratos_historico', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.NS_controle_de_midia_contratos_historico (
    id INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,

    contrato_id INT NOT NULL,

    acao NVARCHAR(40) NOT NULL,
    dados_antes NVARCHAR(MAX) NULL,
    dados_depois NVARCHAR(MAX) NULL,

    created_by NVARCHAR(36) NULL,

    created_at DATETIME2 NOT NULL
      CONSTRAINT DF_ns_midia_contrato_historico_created_at DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_ns_midia_contrato_historico_contrato FOREIGN KEY (contrato_id)
      REFERENCES dbo.NS_controle_de_midia_contratos(id)
      ON DELETE CASCADE
  );

  CREATE INDEX idx_ns_midia_contrato_historico_contrato
    ON dbo.NS_controle_de_midia_contratos_historico(contrato_id);

  CREATE INDEX idx_ns_midia_contrato_historico_created_at
    ON dbo.NS_controle_de_midia_contratos_historico(created_at);
END;
