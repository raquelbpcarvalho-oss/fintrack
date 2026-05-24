import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FinanceiroService } from '../../services/financeiro.service';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TabelaRegistrosComponent } from '../../components/tabela-registros/tabela-registros.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResumoCardsComponent } from '../../components/resumo-cards/resumo-cards.component';
import { FiltrosComponent } from '../../components/filtros/filtros.component';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, BaseChartDirective, TabelaRegistrosComponent, FormsModule, CommonModule, ResumoCardsComponent, FiltrosComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  totalEntradas = 0;
  totalSaidas = 0;
  saldoAtual = 0;
  registrosFiltrados: any[] = [];
  mesSelecionado = '';
  categoriaSelecionada = '';
  categorias: string[] = [];
  graficoCategorias!: ChartConfiguration<'pie'>['data'];
  graficoBarra!: ChartConfiguration<'bar'>['data'];

  registros = [
    {
      id: crypto.randomUUID(),
      descricao: 'Salário',
      tipo: 'Entrada',
      categoria: 'Salário',
      data: '2026-05-21',
      valor: 5000
    },

    {
      id: crypto.randomUUID(),
      descricao: 'Conta de Luz',
      tipo: 'Saída',
      categoria: 'Casa',
      data: '2026-05-20',
      valor: 250
    },

    {
      id: crypto.randomUUID(),
      descricao: 'Bitcoin',
      tipo: 'Investimento',
      categoria: 'Cripto',
      data: '2026-05-19',
      valor: 800
    }
  ];

  constructor(private financeiroService: FinanceiroService) {

    this.registros =
      this.financeiroService.obterRegistros();

    this.categorias =
      this.financeiroService.obterCategorias();

    this.atualizarDashboard();

  }
  atualizarDashboard(): void {
    const registrosDoMes = this.registros.filter(registro => {

      if (this.mesSelecionado === '') {
        return true;
      }

      return registro.data.startsWith(this.mesSelecionado);
    });

    this.totalEntradas = registrosDoMes
      .filter(registro => registro.tipo === 'Entrada')
      .reduce((total, registro) => total + registro.valor, 0);

    this.totalSaidas = registrosDoMes
      .filter(registro => registro.tipo === 'Saída')
      .reduce((total, registro) => total + registro.valor, 0);

    this.saldoAtual = this.financeiroService.calcularSaldo(
      this.totalEntradas,
      this.totalSaidas
    );

    this.graficoBarra = {
  labels: ['Entradas', 'Saídas', 'Saldo'],
  datasets: [
    {
      label: 'Financeiro Mensal',
      data: [
        this.totalEntradas,
        this.totalSaidas,
        this.saldoAtual
      ],
      backgroundColor: [
        '#16a34a',
        '#dc2626',
        this.saldoAtual >= 0 ? '#2563eb' : '#dc2626'
      ]
    }
  ]
};
    const despesas = registrosDoMes.filter(
      registro => registro.tipo === 'Saída'
    );

    const categoriasMap = new Map<string, number>();

    despesas.forEach(registro => {

      const valorAtual =
        categoriasMap.get(registro.categoria) || 0;

      categoriasMap.set(
        registro.categoria,
        valorAtual + registro.valor
      );

    });

    this.graficoCategorias = {
  labels: Array.from(categoriasMap.keys()),

  datasets: [
    {
      data: Array.from(categoriasMap.values()),
      backgroundColor: [
        '#ef4444',
        '#f97316',
        '#eab308',
        '#22c55e',
        '#3b82f6',
        '#8b5cf6',
        '#ec4899'
      ]
    }
  ]
};
    this.aplicarFiltros();
  }
  adicionarRegistro(registro: any): void {

    this.registros.push(registro);

    this.financeiroService.salvarRegistros(this.registros);

    this.atualizarDashboard();

  }

  removerRegistro(id: string): void {

    this.registros = this.registros.filter(
      registro => registro.id !== id
    );

    this.financeiroService.salvarRegistros(this.registros);

    this.atualizarDashboard();

  }
  aplicarFiltros(): void {

    this.registrosFiltrados = this.registros.filter(registro => {

      const atendeMes =
        this.mesSelecionado === '' ||
        registro.data.startsWith(this.mesSelecionado);

      const atendeCategoria =
        this.categoriaSelecionada === '' ||
        registro.categoria === this.categoriaSelecionada;

      return atendeMes && atendeCategoria;
    });

  }
  limparFiltros(): void {
    this.mesSelecionado = '';
    this.categoriaSelecionada = '';
    this.aplicarFiltros();
  }

}