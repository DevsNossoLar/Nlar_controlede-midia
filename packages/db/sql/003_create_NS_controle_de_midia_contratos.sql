IF OBJECT_ID('dbo.NS_controle_de_midia_contratos', 'U') IS NULL
BEGIN
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

    valor_total DECIMAL(12,2) NULL,
    valor_mensal DECIMAL(12,2) NULL,

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

  CREATE INDEX idx_ns_midia_contrato_codFor
    ON dbo.NS_controle_de_midia_contratos(codFor);

  CREATE INDEX idx_ns_midia_contrato_codLoja
    ON dbo.NS_controle_de_midia_contratos(codLoja);

  CREATE INDEX idx_ns_midia_contrato_status
    ON dbo.NS_controle_de_midia_contratos(status);

  CREATE INDEX idx_ns_midia_contrato_tipo_contrato
    ON dbo.NS_controle_de_midia_contratos(tipo_contrato);

  CREATE INDEX idx_ns_midia_contrato_data_inicio
    ON dbo.NS_controle_de_midia_contratos(data_inicio);

  CREATE INDEX idx_ns_midia_contrato_data_fim
    ON dbo.NS_controle_de_midia_contratos(data_fim);
END;
