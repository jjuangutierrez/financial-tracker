import { Component, inject, Input, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Portfolio } from '../../core/models/portfolio.model';
import { PortfolioService } from '../../core/services/portfolio.servie';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar-item.html',
  styleUrl: './sidebar-item.css',
})
export class SidebarItem {
  @Input() portfolio!: Portfolio;

  private portfolioService = inject(PortfolioService);

  optionsVisible = signal(false);
  isEditing = signal(false);
  editedName = signal('');

  isSelected = computed(
    () => this.portfolioService.selectedPortfolioId() === this.portfolio.id
  );

  selectPortfolio() {
    if (!this.isEditing()) {
      this.portfolioService.selectPortfolio(this.portfolio.id);
    }
  }

  toggleOptions(event: MouseEvent) {
    event.stopPropagation();
    this.optionsVisible.update((v) => !v);
  }

  startEditing(event: MouseEvent) {
    event.stopPropagation();
    this.editedName.set(this.portfolio.name);
    this.isEditing.set(true);
    this.optionsVisible.set(false);
  }

  saveEdit() {
    if (this.editedName().trim() !== '') {
      this.portfolioService.renamePortfolio(
        this.portfolio.id,
        this.editedName()
      );
    }
    this.isEditing.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

  delete(event: MouseEvent) {
    event.stopPropagation();
    this.portfolioService.deletePortfolio(this.portfolio.id);
    this.optionsVisible.set(false);
  }
}
