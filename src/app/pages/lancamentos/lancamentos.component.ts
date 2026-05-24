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

  //GET
  carregarRegistros(): void {

    this.financeiroService
      .obterRegistrosApi()
      .subscribe(registros => {

        this.registros = registros;

      });

  }

  buscarPorDescricao(): void {
    this.carregarRegistros();
  }

  //POST
  adicionarRegistro(registro: any): void {

    this.financeiroService
      .adicionarRegistroApi(registro)
      .subscribe(() => {

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

      });

  }
  //DELETE
  removerRegistro(id: string): void {

    const confirmar = confirm(
      'Deseja realmente excluir este registro?'
    );

    if (!confirmar) {
      return;
    }

    this.financeiroService
      .removerRegistroApi(id)
      .subscribe(() => {

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

      });

  }

}
