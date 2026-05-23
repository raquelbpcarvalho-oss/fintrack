import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  private storageKey = 'registros';

  constructor() { }

  salvarRegistros(registros: any[]): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(registros)
    );
  }

  obterRegistros(): any[] {

    const dados = localStorage.getItem(this.storageKey);

    if (dados) {
      return JSON.parse(dados);
    }

    return [];
  }

  calcularSaldo(
    entradas: number,
    saidas: number
  ): number {

    return entradas - saidas;

  }
  calcularTetoGastos(entradas: number, percentual: number): number {
    return entradas * percentual;
  }

  calcularSaldoMeta(tetoGastos: number, saidas: number): number {
    return tetoGastos - saidas;
  }

  calcularDiasRestantesNoMes(): number {
    const hoje = new Date();
    const ultimoDia = new Date(
      hoje.getFullYear(),
      hoje.getMonth() + 1,
      0
    ).getDate();

    return ultimoDia - hoje.getDate();
  }

  calcularGastoDiario(saldoMeta: number, diasRestantes: number): number {
    if (diasRestantes <= 0) {
      return saldoMeta;
    }

    return saldoMeta / diasRestantes;
  }
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
}
