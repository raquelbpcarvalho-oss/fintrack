import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FinanceiroService } from '../../services/financeiro.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-metas',
  imports: [FormsModule, CurrencyPipe, CommonModule],
  templateUrl: './metas.component.html',
  styleUrl: './metas.component.css'
})
export class MetasComponent {

  perfilSelecionado = 'conservador';

  entradas = 0;
  saidas = 0;

  tetoGastos = 0;
  saldoMeta = 0;
  diasRestantes = 0;
  gastoDiario = 0;

  mensagemStatus = '';

  perfis = {
    conservador: 0.5,
    moderado: 0.7,
    arrojado: 0.85
  };

  constructor(private financeiroService: FinanceiroService) {
    const perfilSalvo =
      localStorage.getItem('perfil-financeiro');

    if (perfilSalvo) {
      this.perfilSelecionado = perfilSalvo;
    }

    this.carregarRegistros();
  }

  carregarRegistros(): void {
    // GET: busca os registros da API para calcular as metas
    this.financeiroService
      .obterRegistrosApi()
      .subscribe(registros => {
        this.calcularMetas(registros);
      });
  }

  calcularMetas(registros: any[]): void {
    this.entradas = registros
      .filter(registro => registro.tipo === 'Entrada')
      .reduce((total, registro) => total + registro.valor, 0);

    this.saidas = registros
      .filter(registro => registro.tipo === 'Saída')
      .reduce((total, registro) => total + registro.valor, 0);

    const percentual =
      this.perfis[this.perfilSelecionado as keyof typeof this.perfis];

    localStorage.setItem(
      'perfil-financeiro',
      this.perfilSelecionado
    );

    this.tetoGastos = this.financeiroService.calcularTetoGastos(
      this.entradas,
      percentual
    );

    this.saldoMeta = this.financeiroService.calcularSaldoMeta(
      this.tetoGastos,
      this.saidas
    );

    this.diasRestantes =
      this.financeiroService.calcularDiasRestantesNoMes();

    this.gastoDiario =
      this.financeiroService.calcularGastoDiario(
        this.saldoMeta,
        this.diasRestantes
      );

    if (this.saldoMeta > 0) {
      this.mensagemStatus = 'Situação positiva: você ainda está dentro da meta.';
    } else if (this.saldoMeta === 0) {
      this.mensagemStatus = 'Atenção: você atingiu exatamente o limite da meta.';
    } else {
      this.mensagemStatus = 'Situação negativa: você ultrapassou sua meta de gastos.';
    }
  }
}