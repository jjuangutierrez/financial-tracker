import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Portfolio } from '../../../../core/models/portfolio';

@Component({
  selector: 'app-portfolio-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-item.html',
  styleUrl: './portfolio-item.css'
})
export class PortfolioItem {
  @Input() portfolio!: Portfolio;

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  deleteItem(): void {
    console.log('Delete clicked', this.portfolio);
    this.isMenuOpen = false;
  }

  renameItem(): void {
    console.log('Rename clicked', this.portfolio);
    this.isMenuOpen = false;
  }
}
