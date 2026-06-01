IF OBJECT_ID('dbo.NS_controle_de_midia_contratos', 'U') IS NOT NULL
BEGIN
  UPDATE dbo.NS_controle_de_midia_contratos
  SET tipo_contrato = 'influencer'
  WHERE tipo_contrato = 'influenciador';

  UPDATE dbo.NS_controle_de_midia_contratos
  SET tipo_contrato = 'comissao_agencia'
  WHERE tipo_contrato = 'agencia';

  UPDATE dbo.NS_controle_de_midia_contratos
  SET tipo_contrato = 'lab8_trafego_pagamento'
  WHERE tipo_contrato = 'trafego_pago';

  UPDATE dbo.NS_controle_de_midia_contratos
  SET tipo_contrato = 'diversos'
  WHERE tipo_contrato IN (
    'midia',
    'servico',
    'software',
    'outro'
  );

  UPDATE dbo.NS_controle_de_midia_contratos
  SET tipo_contrato = 'diversos'
  WHERE tipo_contrato NOT IN (
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
  );

  IF EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = 'CK_ns_midia_contrato_tipo'
      AND parent_object_id = OBJECT_ID('dbo.NS_controle_de_midia_contratos')
  )
  BEGIN
    ALTER TABLE dbo.NS_controle_de_midia_contratos
      DROP CONSTRAINT CK_ns_midia_contrato_tipo;
  END;

  ALTER TABLE dbo.NS_controle_de_midia_contratos
    ADD CONSTRAINT CK_ns_midia_contrato_tipo CHECK (
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
    );

  IF EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'idx_ns_midia_contrato_categoria'
      AND object_id = OBJECT_ID('dbo.NS_controle_de_midia_contratos')
  )
  BEGIN
    DROP INDEX idx_ns_midia_contrato_categoria
      ON dbo.NS_controle_de_midia_contratos;
  END;

  IF COL_LENGTH('dbo.NS_controle_de_midia_contratos', 'categoria') IS NOT NULL
  BEGIN
    ALTER TABLE dbo.NS_controle_de_midia_contratos
      DROP COLUMN categoria;
  END;
END;
