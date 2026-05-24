export interface RegistroFinanceiro {
  id?: string;
  descricao: string;
  valor: number;
  tipo: 'Entrada' | 'Saída' | 'Investimento';
  categoria: string;
  data: string;
}