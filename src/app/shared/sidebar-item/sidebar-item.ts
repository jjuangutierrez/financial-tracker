import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 👈 para [(ngModel)]
import { Portfolio } from '../../core/models/portfolio.model';
import { PortfolioService } from '../../core/services/portfolio.servie';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar-item.html',
  styleUrl: './sidebar-item.css'
})
export class SidebarItem {
  @Input() portfolio!: Portfolio;
  portfolioService = inject(PortfolioService);

  optionsVisible = signal(false);
  isEditing = signal(false);
  editedName = signal('');

  toggleOptions(event: MouseEvent) {
    event.stopPropagation();
    this.optionsVisible.update(v => !v);
  }

  startEditing() {
    this.editedName.set(this.portfolio.name); // carga el nombre actual
    this.isEditing.set(true);
    this.optionsVisible.set(false);
  }

  saveEdit() {
    if (this.editedName().trim() !== '') {
      this.portfolioService.renamePortfolio(this.portfolio.id, this.editedName());
      this.portfolio.name = this.editedName(); // actualiza en UI
    }
    this.isEditing.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

  delete() {
    this.portfolioService.deletePortfolio(this.portfolio.id);
    this.optionsVisible.set(false);
  }
}
