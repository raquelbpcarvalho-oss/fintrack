import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tabela-registros',
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './tabela-registros.component.html',
  styleUrl: './tabela-registros.component.css'
})
export class TabelaRegistrosComponent {

  @Input() registros: any[] = [];
  @Input() mostrarAcoes = false;

  @Output() remover = new EventEmitter<string>();

  removerRegistro(id: string): void {
    this.remover.emit(id);
  }

}