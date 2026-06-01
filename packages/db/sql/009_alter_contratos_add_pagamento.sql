IF OBJECT_ID('dbo.NS_controle_de_midia_contratos', 'U') IS NOT NULL
BEGIN
  IF COL_LENGTH('dbo.NS_controle_de_midia_contratos', 'cod_condicao_pagamento') IS NULL
  BEGIN
    ALTER TABLE dbo.NS_controle_de_midia_contratos
      ADD cod_condicao_pagamento INT NULL;
  END;

  IF COL_LENGTH('dbo.NS_controle_de_midia_contratos', 'cod_forma_pagamento') IS NULL
  BEGIN
    ALTER TABLE dbo.NS_controle_de_midia_contratos
      ADD cod_forma_pagamento INT NULL;
  END;
END;
