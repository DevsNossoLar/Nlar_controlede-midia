IF OBJECT_ID('dbo.NS_controle_de_midia_contrato_anexos', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.NS_controle_de_midia_contrato_anexos (
    id INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,

    contrato_id INT NOT NULL,

    tipo NVARCHAR(30) NOT NULL
      CONSTRAINT CK_ns_midia_contrato_anexo_tipo CHECK (
        tipo IN (
          'contrato',
          'proposta',
          'aditivo',
          'aprovacao',
          'documento',
          'outro'
        )
      ),

    nome_original NVARCHAR(255) NOT NULL,
    mime_type NVARCHAR(120) NOT NULL,
    tamanho_bytes BIGINT NULL,
    arquivo_base64 NVARCHAR(MAX) NOT NULL,

    created_by NVARCHAR(36) NULL,

    created_at DATETIME2 NOT NULL
      CONSTRAINT DF_ns_midia_contrato_anexo_created_at DEFAULT SYSUTCDATETIME(),

    updated_at DATETIME2 NULL,

    CONSTRAINT FK_ns_midia_contrato_anexo_contrato FOREIGN KEY (contrato_id)
      REFERENCES dbo.NS_controle_de_midia_contratos(id)
      ON DELETE CASCADE
  );

  CREATE INDEX idx_ns_midia_contrato_anexo_contrato
    ON dbo.NS_controle_de_midia_contrato_anexos(contrato_id);

  CREATE INDEX idx_ns_midia_contrato_anexo_tipo
    ON dbo.NS_controle_de_midia_contrato_anexos(tipo);
END;
