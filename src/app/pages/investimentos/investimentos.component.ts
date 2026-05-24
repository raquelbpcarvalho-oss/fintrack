import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceiroService } from '../../services/financeiro.service';
import { RegistroFinanceiro } from '../../models/registro-financeiro.model';
import { TabelaRegistrosComponent } from '../../components/tabela-registros/tabela-registros.component';
import { ResumoCardsComponent } from '../../components/resumo-cards/resumo-cards.component';

@Component({
  selector: 'app-investimentos',
  imports: [
    CommonModule,
    TabelaRegistrosComponent,
    ResumoCardsComponent
  ],
  templateUrl: './investimentos.component.html',
  styleUrl: './investimentos.component.css'
})
export class InvestimentosComponent {

  investimentos: RegistroFinanceiro[] = [];

  totalInvestido = 0;

  constructor(private financeiroService: FinanceiroService) {
    this.carregarInvestimentos();
  }

  carregarInvestimentos(): void {

    this.financeiroService
      .obterRegistrosApi()
      .subscribe(registros => {

        // Filtra somente investimentos
        this.investimentos = registros.filter(
          registro => registro.tipo === 'Investimento'
        );

        // Soma total investido
        this.totalInvestido = this.investimentos.reduce(
          (total, investimento) =>
            total + investimento.valor,
          0
        );
      });
  }
}