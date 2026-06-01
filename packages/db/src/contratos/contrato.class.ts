import {
  contratoEnum,
  ContratoProps,
  CriarContratoInput,
  isTipoContratoValido,
  normalizarTipoContrato,
  statusContratoEnum,
  atualizarContratoInput,
} from './types'

export class Contrato {
  private props: ContratoProps

  private constructor(props: ContratoProps) {
    this.props = props
  }

  static criarContrato(input: CriarContratoInput): Contrato {
    const codFor = input.codFor
    const titulo = input.titulo?.trim() || input.numContrato?.trim()
    const codLoja = input.codLoja
    const tipoContrato =
      (input.tipoContrato
        ? normalizarTipoContrato(String(input.tipoContrato))
        : null) ?? contratoEnum.DIVERSOS
    const valorTotal = input.valorTotal ?? input.valorContratado ?? null
    const valorMensal = input.valorMensal ?? null
    const codCondicaoPagamento = input.codCondicaoPagamento ?? null
    const codFormaPagamento = input.codFormaPagamento ?? null
    const dataFim = input.dataFim ?? null

    if (!codFor?.trim()) {
      throw new Error('Código do fornecedor é obrigatório')
    }

    if (!codLoja?.trim()) {
      throw new Error('Código da loja é obrigatório')
    }

    if (!titulo?.trim()) {
      throw new Error('Título do contrato é obrigatório')
    }

    Contrato.validarTipoContrato(tipoContrato)

    if (!input.dataInicio) {
      throw new Error('Data de início é obrigatória')
    }

    if (dataFim && dataFim < input.dataInicio) {
      throw new Error('Data final não pode ser menor que a data inicial.')
    }

    Contrato.validarValores(valorTotal, valorMensal)
    Contrato.validarDiaVencimento(input.diaVencimentoPadrao ?? null)
    Contrato.validarCodigoPagamento(codCondicaoPagamento, 'CondiÃ§Ã£o de pagamento')
    Contrato.validarCodigoPagamento(codFormaPagamento, 'Forma de pagamento')

    if (input.recorrente && !valorMensal) {
      throw new Error('Valor mensal é obrigatório para contrato recorrente')
    }

    return new Contrato({
      codFor: codFor.trim(),
      titulo: titulo.trim(),
      descricao: Contrato.normalizarTexto(input.descricao),
      codLoja: codLoja.trim(),
      tipoContrato,
      numPrevisao: Contrato.normalizarTexto(input.numPrevisao),
      numCotacao: Contrato.normalizarTexto(input.numCotacao),
      dataInicio: input.dataInicio,
      dataFim,
      valorTotal,
      valorMensal,
      codCondicaoPagamento,
      codFormaPagamento,
      recorrente: input.recorrente ?? false,
      diaVencimentoPadrao: input.diaVencimentoPadrao ?? null,
      observacao: Contrato.normalizarTexto(input.observacao),
      criadoPor: Contrato.normalizarTexto(input.criadoPor),
      criadoEm: new Date(),
      atualizadoEm: null,
      status: statusContratoEnum.ATIVO,
    })
  }

  static restaurar(props: ContratoProps): Contrato {
    return new Contrato(props)
  }

  atualizar(input: atualizarContratoInput): void {
    const novoCodFor = input.codFor ?? this.props.codFor
    const novoCodLoja = input.codLoja ?? this.props.codLoja
    const novoTitulo = input.titulo?.trim() || input.numContrato?.trim() || this.props.titulo
    const novoTipoContrato =
      (input.tipoContrato
        ? normalizarTipoContrato(String(input.tipoContrato))
        : null) ?? this.props.tipoContrato
    const novaDataInicio = input.dataInicio ?? this.props.dataInicio
    const novaDataFim = input.dataFim ?? this.props.dataFim
    const novoValorTotal = input.valorTotal ?? input.valorContratado ?? this.props.valorTotal
    const novoValorMensal = input.valorMensal ?? this.props.valorMensal
    const novoCodCondicaoPagamento =
      input.codCondicaoPagamento ?? this.props.codCondicaoPagamento
    const novoCodFormaPagamento = input.codFormaPagamento ?? this.props.codFormaPagamento
    const novoRecorrente = input.recorrente ?? this.props.recorrente
    const novoDiaVencimentoPadrao =
      input.diaVencimentoPadrao ?? this.props.diaVencimentoPadrao

    if (novaDataFim && novaDataFim < novaDataInicio) {
      throw new Error('Data final não pode ser menor que a data inicial.')
    }

    if (!novoCodFor.trim()) {
      throw new Error('Código do fornecedor é obrigatório')
    }

    if (!novoCodLoja.trim()) {
      throw new Error('Código da loja é obrigatório')
    }

    if (!novoTitulo.trim()) {
      throw new Error('Título do contrato é obrigatório')
    }

    Contrato.validarTipoContrato(novoTipoContrato)
    Contrato.validarValores(novoValorTotal, novoValorMensal)
    Contrato.validarDiaVencimento(novoDiaVencimentoPadrao)
    Contrato.validarCodigoPagamento(novoCodCondicaoPagamento, 'CondiÃ§Ã£o de pagamento')
    Contrato.validarCodigoPagamento(novoCodFormaPagamento, 'Forma de pagamento')

    if (novoRecorrente && !novoValorMensal) {
      throw new Error('Valor mensal é obrigatório para contrato recorrente')
    }

    this.props = {
      ...this.props,
      codFor: novoCodFor.trim(),
      codLoja: novoCodLoja.trim(),
      titulo: novoTitulo.trim(),
      descricao:
        typeof input.descricao === 'undefined'
          ? this.props.descricao
          : Contrato.normalizarTexto(input.descricao),
      numPrevisao:
        typeof input.numPrevisao === 'undefined'
          ? this.props.numPrevisao
          : Contrato.normalizarTexto(input.numPrevisao),
      numCotacao:
        typeof input.numCotacao === 'undefined'
          ? this.props.numCotacao
          : Contrato.normalizarTexto(input.numCotacao),
      tipoContrato: novoTipoContrato,
      dataInicio: novaDataInicio,
      dataFim: novaDataFim,
      valorTotal: novoValorTotal,
      valorMensal: novoValorMensal,
      codCondicaoPagamento: novoCodCondicaoPagamento,
      codFormaPagamento: novoCodFormaPagamento,
      recorrente: novoRecorrente,
      diaVencimentoPadrao: novoDiaVencimentoPadrao,
      observacao:
        typeof input.observacao === 'undefined'
          ? this.props.observacao
          : Contrato.normalizarTexto(input.observacao),
      status: input.status ?? this.props.status,
      atualizadoEm: new Date(),
    }
  }

  cancelar(): void {
    if (this.props.status === statusContratoEnum.ENCERRADO) {
      throw new Error('Contrato já está encerrado.')
    }

    if (this.props.status === statusContratoEnum.CANCELADO) {
      throw new Error('Contrato já está cancelado.')
    }

    if (this.props.status === statusContratoEnum.SUSPENSO) {
      throw new Error('Contrato já está suspenso.')
    }

    this.props.status = statusContratoEnum.CANCELADO
    this.props.atualizadoEm = new Date()
  }

  encerrar(): void {
    if (this.props.status === statusContratoEnum.CANCELADO) {
      throw new Error('Contrato cancelado não pode ser encerrado.')
    }

    if (this.props.status === statusContratoEnum.ENCERRADO) {
      throw new Error('Contrato já está encerrado.')
    }

    this.props.status = statusContratoEnum.ENCERRADO
    this.props.atualizadoEm = new Date()
  }

  ativar(): void {
    if (this.props.status === statusContratoEnum.CANCELADO) {
      throw new Error('Contrato não pode ser ativado pois está cancelado.')
    }

    if (this.props.status === statusContratoEnum.ENCERRADO) {
      throw new Error('Contrato não pode ser ativado pois está encerrado.')
    }

    if (this.props.status === statusContratoEnum.SUSPENSO) {
      throw new Error('Contrato não pode ser ativado pois está suspenso.')
    }

    this.props.status = statusContratoEnum.ATIVO
    this.props.atualizadoEm = new Date()
  }

  get id(): number | undefined {
    return this.props.id
  }

  get status(): statusContratoEnum {
    return this.props.status
  }

  toJson(): ContratoProps {
    return {
      ...this.props,
      id: this.id,
    }
  }

  private static normalizarTexto(value: string | null | undefined): string | null {
    const text = value?.trim()
    return text ? text : null
  }

  private static validarTipoContrato(value: contratoEnum): void {
    if (!isTipoContratoValido(value)) {
      throw new Error('Tipo de contrato inválido')
    }
  }

  private static validarValores(valorTotal: number | null, valorMensal: number | null): void {
    if (valorTotal !== null && valorTotal < 0) {
      throw new Error('Valor total não pode ser negativo')
    }

    if (valorMensal !== null && valorMensal < 0) {
      throw new Error('Valor mensal não pode ser negativo')
    }
  }

  private static validarDiaVencimento(value: number | null): void {
    if (value === null) return

    if (!Number.isInteger(value) || value < 1 || value > 31) {
      throw new Error('Dia de vencimento padrão deve estar entre 1 e 31')
    }
  }

  private static validarCodigoPagamento(value: number | null, label: string): void {
    if (value === null) return

    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`${label} invÃ¡lida`)
    }
  }
}
