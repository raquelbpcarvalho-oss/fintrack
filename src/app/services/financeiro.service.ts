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
  calcularEvolucaoMensal(registros: any[]): any[] {

    const mesesMap = new Map<string, any>();

    registros.forEach(registro => {

      const mes = registro.data.substring(0, 7);

      if (!mesesMap.has(mes)) {
        mesesMap.set(mes, {
          mes,
          entradas: 0,
          saidas: 0,
          saldo: 0
        });
      }

      const resumoMes = mesesMap.get(mes);

      if (registro.tipo === 'Entrada') {
        resumoMes.entradas += registro.valor;
      }

      if (registro.tipo === 'Saída') {
        resumoMes.saidas += registro.valor;
      }

      resumoMes.saldo =
        resumoMes.entradas - resumoMes.saidas;
    });

    return Array.from(mesesMap.values());
  }
}
