import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  darkMode = false;

  constructor() {
    const temaSalvo = localStorage.getItem('tema');
    this.darkMode = temaSalvo === 'dark';

    this.aplicarTema();
  }

  alternarTema(): void {
    this.darkMode = !this.darkMode;

    localStorage.setItem(
      'tema',
      this.darkMode ? 'dark' : 'light'
    );

    this.aplicarTema();
  }

  aplicarTema(): void {
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}