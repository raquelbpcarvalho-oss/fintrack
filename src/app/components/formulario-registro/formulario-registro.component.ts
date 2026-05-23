import { Component, EventEmitter, Output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FinanceiroService } from '../../services/financeiro.service';
import { CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario-registro',
  imports: [FormsModule, CurrencyPipe, CommonModule],
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
  categorias: string[] = [];

  constructor(private financeiroService: FinanceiroService) {

  this.categorias =
    this.financeiroService.obterCategorias();

}

  adicionarRegistro(): void {

    if (!this.descricao || !this.tipo || !this.categoria || !this.data) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (this.valor <= 0) {
      alert('O valor precisa ser maior que zero.');
      return;
    }

    const hoje = new Date();
    const dataInformada = new Date(this.data);

    if (
      (this.tipo === 'Entrada' || this.tipo === 'Saída') && //bloqueia apenas para entradas e saídas, investimentos podem ser futuros
      dataInformada > hoje
    ) {
      alert('Não é permitido cadastrar datas futuras para entradas e saídas.');
      return;
    }

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