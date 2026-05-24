import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumo-cards',
  imports: [CurrencyPipe, MatCardModule, CommonModule],
  templateUrl: './resumo-cards.component.html',
  styleUrl: './resumo-cards.component.css'
})
export class ResumoCardsComponent {

  @Input() totalEntradas = 0;
  @Input() totalSaidas = 0;
  @Input() saldoAtual = 0;

}
