/*
  Padrao do modulo: PK e FK internas = INT IDENTITY (ver packages/db/sql/README.md).

  Converte contratos (e anexos de contrato, se existir) de UNIQUEIDENTIFIER para INT IDENTITY.
  Se 003 ja rodou com GUID: execute este script, depois rode 004 novamente.

  Se falhou com Msg 206 na linha do CHECKIDENT: a tabela ja pode estar em INT com dados.
  Execute novamente o script inteiro (o bloco apos GO conclui indices e reseed).
*/

IF OBJECT_ID('dbo.NS_controle_de_midia_contratos', 'U') IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.NS_controle_de_midia_contratos')
      AND name = 'id'
      AND system_type_id = 36
  )
BEGIN
  IF OBJECT_ID('dbo.NS_controle_de_midia_contrato_anexos', 'U') IS NOT NULL
  BEGIN
    DROP TABLE dbo.NS_controle_de_midia_contrato_anexos;
  END;

  IF OBJECT_ID('dbo.NS_controle_de_midia_contratos_uuid_backup', 'U') IS NOT NULL
  BEGIN
    DROP TABLE dbo.NS_controle_de_midia_contratos_uuid_backup;
  END;

  SELECT *
  INTO dbo.NS_controle_de_midia_contratos_uuid_backup
  FROM dbo.NS_controle_de_midia_contratos;

  DROP TABLE dbo.NS_controle_de_midia_contratos;

  CREATE TABLE dbo.NS_controle_de_midia_contratos (
    id INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,

    codFor NVARCHAR(36) NOT NULL,
    codLoja NVARCHAR(36) NOT NULL,

    titulo NVARCHAR(180) NOT NULL,
    descricao NVARCHAR(MAX) NULL,

    tipo_contrato NVARCHAR(40) NOT NULL
      CONSTRAINT CK_ns_midia_contrato_tipo CHECK (
        tipo_contrato IN (
          'televisao',
          'radio',
          'carro_de_som',
          'painel_de_led',
          'correios',
          'frete_rapido',
          'outdoor',
          'influencer',
          'comunicacao_visual',
          'entrega_digital',
          'comissao_agencia',
          'google_facebook',
          'lab8_trafego_pagamento',
          'rad_nwsys_kigi',
          'idx_data_lb_link',
          'serasa_clear_sale',
          'safetec_licencas_email',
          'listenx',
          'anymarket',
          'rd_station',
          'diversos'
        )
      ),

    valor_total DECIMAL(12, 2) NULL,
    valor_mensal DECIMAL(12, 2) NULL,

    cod_condicao_pagamento INT NULL,
    cod_forma_pagamento INT NULL,

    data_inicio DATE NOT NULL,
    data_fim DATE NULL,

    status NVARCHAR(20) NOT NULL
      CONSTRAINT CK_ns_midia_contrato_status CHECK (
        status IN (
          'rascunho',
          'ativo',
          'suspenso',
          'encerrado',
          'cancelado'
        )
      ),

    recorrente BIT NOT NULL
      CONSTRAINT DF_ns_midia_contrato_recorrente DEFAULT 0,

    dia_vencimento_padrao INT NULL
      CONSTRAINT CK_ns_midia_contrato_dia_vencimento CHECK (
        dia_vencimento_padrao IS NULL
        OR dia_vencimento_padrao BETWEEN 1 AND 31
      ),

    observacao NVARCHAR(MAX) NULL,

    created_by NVARCHAR(36) NULL,

    created_at DATETIME2 NOT NULL
      CONSTRAINT DF_ns_midia_contrato_created_at DEFAULT SYSUTCDATETIME(),

    updated_at DATETIME2 NULL
  );

  SET IDENTITY_INSERT dbo.NS_controle_de_midia_contratos ON;

  INSERT INTO dbo.NS_controle_de_midia_contratos (
    id,
    codFor,
    codLoja,
    titulo,
    descricao,
    tipo_contrato,
    valor_total,
    valor_mensal,
    cod_condicao_pagamento,
    cod_forma_pagamento,
    data_inicio,
    data_fim,
    status,
    recorrente,
    dia_vencimento_padrao,
    observacao,
    created_by,
    created_at,
    updated_at
  )
  SELECT
    ROW_NUMBER() OVER (ORDER BY created_at, titulo),
    CONVERT(NVARCHAR(36), codFor),
    CONVERT(NVARCHAR(36), codLoja),
    titulo,
    descricao,
    tipo_contrato,
    valor_total,
    valor_mensal,
    NULL,
    NULL,
    data_inicio,
    data_fim,
    status,
    recorrente,
    dia_vencimento_padrao,
    observacao,
    CONVERT(NVARCHAR(36), created_by),
    created_at,
    updated_at
  FROM dbo.NS_controle_de_midia_contratos_uuid_backup;

  SET IDENTITY_INSERT dbo.NS_controle_de_midia_contratos OFF;
END;
GO

/*
  Novo batch: metadata de id ja e INT (evita Msg 206 int vs uniqueidentifier no mesmo batch).
  Tambem conclui migracao se o script anterior parou antes dos indices/reseed.
*/
IF OBJECT_ID('dbo.NS_controle_de_midia_contratos', 'U') IS NOT NULL
BEGIN
  DECLARE @maxId INT;

  SELECT @maxId = MAX(id) FROM dbo.NS_controle_de_midia_contratos;
  SET @maxId = ISNULL(@maxId, 0);

  DBCC CHECKIDENT ('dbo.NS_controle_de_midia_contratos', RESEED, @maxId);

  IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.NS_controle_de_midia_contratos')
      AND name = 'idx_ns_midia_contrato_codFor'
  )
  BEGIN
    CREATE INDEX idx_ns_midia_contrato_codFor
      ON dbo.NS_controle_de_midia_contratos(codFor);
  END;

  IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.NS_controle_de_midia_contratos')
      AND name = 'idx_ns_midia_contrato_codLoja'
  )
  BEGIN
    CREATE INDEX idx_ns_midia_contrato_codLoja
      ON dbo.NS_controle_de_midia_contratos(codLoja);
  END;

  IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.NS_controle_de_midia_contratos')
      AND name = 'idx_ns_midia_contrato_status'
  )
  BEGIN
    CREATE INDEX idx_ns_midia_contrato_status
      ON dbo.NS_controle_de_midia_contratos(status);
  END;

  IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.NS_controle_de_midia_contratos')
      AND name = 'idx_ns_midia_contrato_tipo_contrato'
  )
  BEGIN
    CREATE INDEX idx_ns_midia_contrato_tipo_contrato
      ON dbo.NS_controle_de_midia_contratos(tipo_contrato);
  END;

  IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.NS_controle_de_midia_contratos')
      AND name = 'idx_ns_midia_contrato_data_inicio'
  )
  BEGIN
    CREATE INDEX idx_ns_midia_contrato_data_inicio
      ON dbo.NS_controle_de_midia_contratos(data_inicio);
  END;

  IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.NS_controle_de_midia_contratos')
      AND name = 'idx_ns_midia_contrato_data_fim'
  )
  BEGIN
    CREATE INDEX idx_ns_midia_contrato_data_fim
      ON dbo.NS_controle_de_midia_contratos(data_fim);
  END;
END;
