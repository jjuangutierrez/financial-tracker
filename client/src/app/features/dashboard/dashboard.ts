import { Component, inject } from '@angular/core';
import { Sidebar } from './components/sidebar/sidebar';
import { TransactionPanel } from './components/transaction-panel/transaction-panel';
import { Portfolio } from '../../core/models/portfolio';
import { PortfolioSelectionService } from '../../core/services/portfolio-selection.service';
import { PortfolioSummary } from './components/portfolio-summary/portfolio-summary';
import { PortfolioService } from '../../core/services/portfolio.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, TransactionPanel, PortfolioSummary, CommonModule, FormsModule],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  selectedPortfolio: Portfolio | null = null;
  isEditingDescription = false;
  editedDescription = '';

  private portfolioSelectionService = inject(PortfolioSelectionService);
  private portfolioService = inject(PortfolioService);

  ngOnInit(): void {
    this.portfolioSelectionService.selectedPortfolio$.subscribe((portfolio) => {
      this.selectedPortfolio = portfolio;
      if (portfolio) {
        this.editedDescription = portfolio.description;
      }
    });
  }

  startEditingDescription() {
    this.isEditingDescription = true;
    this.editedDescription = this.selectedPortfolio?.description || '';
  }

  saveDescription() {
  if (this.selectedPortfolio) {
    this.portfolioService.updatePortfolio(this.selectedPortfolio.id, {
      description: this.editedDescription,
    });

    this.selectedPortfolio = {
      ...this.selectedPortfolio,
      description: this.editedDescription,
    };

    this.isEditingDescription = false;
  }
}


  cancelEditing() {
    this.isEditingDescription = false;
  }
}
