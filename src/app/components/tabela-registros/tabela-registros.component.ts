import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabela-registros',
  imports: [CommonModule],
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