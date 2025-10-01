import { Component, inject } from '@angular/core';
import { Sidebar } from './components/sidebar/sidebar';
import { TransactionPanel } from './components/transaction-panel/transaction-panel';
import { Portfolio } from '../../core/models/portfolio';
import { PortfolioSelectionService } from '../../core/services/portfolio-selection.service';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, TransactionPanel],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  selectedPortfolio: Portfolio | null = null;
  private portfolioSelectionService = inject(PortfolioSelectionService);

  ngOnInit(): void {
    this.portfolioSelectionService.selectedPortfolio$.subscribe((portfolio) => {
      this.selectedPortfolio = portfolio;
      console.log('Dashboard recibió selección:', portfolio);
    });
  }
}
