export interface Vacina {
  id: number;
  nome: string;
  tipo: string;
  especie: string;
  fabricante: string;
  descricao?: string;
  lote: string;
  validade: string;
  quantidade: number;
  dataFabricacao: string;
  dataEntrada: string;
  responsavel: string;
  fornecedor: string;
  notaFiscal: string;
  valorUnitario: number;
  valorTotal: number;
  temperatura: string;
  localArmazenamento: string;
  refrigeracao?: number;
}
