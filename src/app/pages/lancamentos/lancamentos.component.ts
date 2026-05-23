import { Component } from '@angular/core';
import { FormularioRegistroComponent } from '../../components/formulario-registro/formulario-registro.component';
import { TabelaRegistrosComponent } from '../../components/tabela-registros/tabela-registros.component';
import { FinanceiroService } from '../../services/financeiro.service';

@Component({
  selector: 'app-lancamentos',
  imports: [FormularioRegistroComponent, TabelaRegistrosComponent],
  templateUrl: './lancamentos.component.html',
  styleUrl: './lancamentos.component.css'
})
export class LancamentosComponent {

  registros: any[] = [];

  constructor(private financeiroService: FinanceiroService) {
    this.carregarRegistros();
  }

  carregarRegistros(): void {
    this.registros = this.financeiroService.obterRegistros();
  }

  adicionarRegistro(registro: any): void {
    this.registros.push(registro);
    this.financeiroService.salvarRegistros(this.registros);
    this.carregarRegistros();
  }

  removerRegistro(id: string): void {
    this.registros = this.registros.filter(
      registro => registro.id !== id
    );

    this.financeiroService.salvarRegistros(this.registros);
    this.carregarRegistros();
  }
}
