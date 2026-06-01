IF OBJECT_ID('dbo.NS_controle_de_midia_contratos', 'U') IS NOT NULL
BEGIN
  -- Condicao de pagamento (tabela externa: prazo / condicao)
  IF COL_LENGTH('dbo.NS_controle_de_midia_contratos', 'cod_condicao_pagamento') IS NULL
  BEGIN
    ALTER TABLE dbo.NS_controle_de_midia_contratos
      ADD cod_condicao_pagamento INT NULL;
  END;

  -- Forma / tipo de pagamento (tabela externa: forma de pagamento)
  IF COL_LENGTH('dbo.NS_controle_de_midia_contratos', 'cod_forma_pagamento') IS NULL
  BEGIN
    ALTER TABLE dbo.NS_controle_de_midia_contratos
      ADD cod_forma_pagamento INT NULL;
  END;

  IF COL_LENGTH('dbo.NS_controle_de_midia_contratos', 'num_previsao') IS NULL
  BEGIN
    ALTER TABLE dbo.NS_controle_de_midia_contratos
      ADD num_previsao NVARCHAR(60) NULL;
  END;

  IF COL_LENGTH('dbo.NS_controle_de_midia_contratos', 'num_cotacao') IS NULL
  BEGIN
    ALTER TABLE dbo.NS_controle_de_midia_contratos
      ADD num_cotacao NVARCHAR(60) NULL;
  END;
END;
