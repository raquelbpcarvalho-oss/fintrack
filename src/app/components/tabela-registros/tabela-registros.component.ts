import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common'; 
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tabela-registros',
  imports: [CommonModule, CurrencyPipe, DatePipe],
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