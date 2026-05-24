import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Importamos o model/interface que representa um lançamento financeiro
import { RegistroFinanceiro } from '../models/registro-financeiro.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  // Endereço da nossa API fake do json-server
  private apiUrl = 'http://localhost:3000/registros';

  constructor(private http: HttpClient) { }

  // Busca todos os registros da API fake
  obterRegistrosApi(): Observable<RegistroFinanceiro[]> {
    return this.http.get<RegistroFinanceiro[]>(this.apiUrl);
  }

  // Cadastra um novo registro na API fake
  adicionarRegistroApi(registro: RegistroFinanceiro): Observable<RegistroFinanceiro> {
    return this.http.post<RegistroFinanceiro>(this.apiUrl, registro);
  }

  // Remove um registro pelo ID
  removerRegistroApi(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Calcula o saldo geral
  calcularSaldo(entradas: number, saidas: number): number {
    return entradas - saidas;
  }

  // Calcula o limite de gastos baseado em percentual
  calcularTetoGastos(entradas: number, percentual: number): number {
    return entradas * percentual;
  }

  // Calcula quanto ainda pode gastar dentro da meta
  calcularSaldoMeta(tetoGastos: number, saidas: number): number {
    return tetoGastos - saidas;
  }

  // Calcula quantos dias faltam para terminar o mês atual
  calcularDiasRestantesNoMes(): number {
    const hoje = new Date();

    const ultimoDia = new Date(
      hoje.getFullYear(),
      hoje.getMonth() + 1,
      0
    ).getDate();

    return ultimoDia - hoje.getDate();
  }

  // Calcula quanto pode gastar por dia até o fim do mês
  calcularGastoDiario(saldoMeta: number, diasRestantes: number): number {
    if (diasRestantes <= 0) {
      return saldoMeta;
    }

    return saldoMeta / diasRestantes;
  }

  // Lista de categorias usadas no formulário
  obterCategorias(): string[] {
    return [
      'Salário',
      'Casa',
      'Alimentação',
      'Transporte',
      'Lazer',
      'Saúde',
      'Educação',
      'Investimentos'
    ];
  }

  // Calcula o resumo financeiro agrupado por mês
  calcularEvolucaoMensal(registros: RegistroFinanceiro[]) {
    
    // O Map guarda os dados agrupados por mês.
    // A chave é o mês, exemplo: "2026-05"
    // O valor é um objeto resumo, com entradas, saídas e saldo daquele mês.
    const mesesMap = new Map<
      string,
      {
        mes: string;
        entradas: number;
        saidas: number;
        saldo: number;
      }
    >();

    registros.forEach(registro => {
      const mes = registro.data.substring(0, 7);

      // Se o mês ainda não existe no Map, criamos ele zerado
      if (!mesesMap.has(mes)) {
        mesesMap.set(mes, {
          mes: mes,
          entradas: 0,
          saidas: 0,
          saldo: 0
        });
      }

      // Pegamos o resumo daquele mês
      const resumoMes = mesesMap.get(mes);

      // Segurança para o TypeScript entender que resumoMes existe
      if (!resumoMes) {
        return;
      }

      // Se for entrada, soma nas entradas
      if (registro.tipo === 'Entrada') {
        resumoMes.entradas += registro.valor;
      }

      // Se for saída, soma nas saídas
      if (registro.tipo === 'Saída') {
        resumoMes.saidas += registro.valor;
      }

      // Atualiza o saldo daquele mês
      resumoMes.saldo = resumoMes.entradas - resumoMes.saidas;
    });

    // Transforma o Map em array para usar em gráfico/tabela
    return Array.from(mesesMap.values());
  }
}