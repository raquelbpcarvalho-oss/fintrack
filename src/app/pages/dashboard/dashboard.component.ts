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
import { RegistroFinanceiro } from '../../models/registro-financeiro.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    BaseChartDirective,
    TabelaRegistrosComponent,
    FormsModule,
    CommonModule,
    ResumoCardsComponent,
    FiltrosComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  totalEntradas = 0;
  totalSaidas = 0;
  saldoAtual = 0;

  registros: RegistroFinanceiro[] = [];
  registrosFiltrados: RegistroFinanceiro[] = [];

  mesSelecionado = '';
  categoriaSelecionada = '';
  categorias: string[] = [];

  graficoCategorias!: ChartConfiguration<'pie'>['data'];
  graficoBarra!: ChartConfiguration<'bar'>['data'];
  graficoEvolucao!: ChartConfiguration<'line'>['data'];

  constructor(private financeiroService: FinanceiroService) {
    this.categorias = this.financeiroService.obterCategorias();

    this.carregarRegistros();
  }

  carregarRegistros(): void {
    // GET: busca os registros da API json-server
    this.financeiroService
      .obterRegistrosApi()
      .subscribe(registros => {
        this.registros = registros;

        this.atualizarDashboard();
      });
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

    const evolucaoMensal =
      this.financeiroService.calcularEvolucaoMensal(this.registros);

    this.graficoEvolucao = {
      labels: evolucaoMensal.map(item => item.mes),
      datasets: [
        {
          label: 'Entradas',
          data: evolucaoMensal.map(item => item.entradas),
          borderColor: '#16a34a',
          backgroundColor: '#16a34a',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Saídas',
          data: evolucaoMensal.map(item => item.saidas),
          borderColor: '#dc2626',
          backgroundColor: '#dc2626',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Saldo',
          data: evolucaoMensal.map(item => item.saldo),
          borderColor: '#2563eb',
          backgroundColor: '#2563eb',
          tension: 0.4,
          fill: false
        }
      ]
    };

    this.aplicarFiltros();
  }

  adicionarRegistro(registro: RegistroFinanceiro): void {
    // POST: envia um novo registro para a API
    this.financeiroService
      .adicionarRegistroApi(registro)
      .subscribe(() => {
        this.carregarRegistros();
      });
  }

  removerRegistro(id: string): void {
    // DELETE: remove um registro da API pelo id
    this.financeiroService
      .removerRegistroApi(id)
      .subscribe(() => {
        this.carregarRegistros();
      });
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