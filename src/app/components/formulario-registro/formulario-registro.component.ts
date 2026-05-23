import { Component, EventEmitter, Output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario-registro',
  imports: [FormsModule],
  templateUrl: './formulario-registro.component.html',
  styleUrl: './formulario-registro.component.css'
})
export class FormularioRegistroComponent {

  @Output() adicionar = new EventEmitter<any>();

  descricao = '';
  tipo = 'Entrada';
  categoria = '';
  data = '';
  valor = 0;

  adicionarRegistro(): void {
    const novoRegistro = {
      id: crypto.randomUUID(),
      descricao: this.descricao,
      tipo: this.tipo,
      categoria: this.categoria,
      data: this.data,
      valor: Number(this.valor)
    };

    this.adicionar.emit(novoRegistro);

    this.descricao = '';
    this.tipo = 'Entrada';
    this.categoria = '';
    this.data = '';
    this.valor = 0;
  }
} 