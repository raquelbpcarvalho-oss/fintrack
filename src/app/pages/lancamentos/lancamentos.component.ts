import { Component } from '@angular/core';
import { FormularioRegistroComponent } from '../../components/formulario-registro/formulario-registro.component';
import { TabelaRegistrosComponent } from '../../components/tabela-registros/tabela-registros.component';
import { FinanceiroService } from '../../services/financeiro.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lancamentos',
  imports: [FormsModule, FormularioRegistroComponent, TabelaRegistrosComponent, MatSnackBarModule],
  templateUrl: './lancamentos.component.html',
  styleUrl: './lancamentos.component.css'
})
export class LancamentosComponent {

  registros: any[] = [];
  termoBusca = '';

  constructor(private financeiroService: FinanceiroService, private snackBar: MatSnackBar) {
    this.carregarRegistros();
  }
  carregarRegistros(): void {

    const todosRegistros =
      this.financeiroService.obterRegistros();

    this.registros = todosRegistros.filter(registro =>

      registro.descricao
        .toLowerCase()
        .includes(this.termoBusca.toLowerCase())

    );
  }
  buscarPorDescricao(): void {
    this.carregarRegistros();
  }

  adicionarRegistro(registro: any): void {
    this.registros.push(registro);
    this.financeiroService.salvarRegistros(this.registros);
    this.carregarRegistros();
    this.snackBar.open(
      'Registro adicionado com sucesso!',
      'Fechar',
      {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    );
  }
  removerRegistro(id: string): void {

    const confirmar = confirm(
      'Deseja realmente excluir este registro?'
    );

    if (!confirmar) {
      return;
    }

    this.registros = this.registros.filter(
      registro => registro.id !== id
    );

    this.financeiroService.salvarRegistros(this.registros);

    this.carregarRegistros();
    this.snackBar.open(
      'Registro removido com sucesso!',
      'Fechar',
      {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    );
  }
}
