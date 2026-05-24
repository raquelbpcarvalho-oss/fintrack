import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filtros',
  imports: [FormsModule, CommonModule],
  templateUrl: './filtros.component.html',
  styleUrl: './filtros.component.css'
})
export class FiltrosComponent {

  @Input() mesSelecionado = '';
  @Input() categoriaSelecionada = '';
  @Input() categorias: string[] = [];

  @Output() mesSelecionadoChange =
    new EventEmitter<string>();

  @Output() categoriaSelecionadaChange =
    new EventEmitter<string>();

  @Output() limpar =
    new EventEmitter<void>();

}
