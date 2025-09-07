import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio.servie';

@Component({
  selector: 'app-dashboard-summary',
  templateUrl: './dashboard-summary.html',
  styleUrl: './dashboard-summary.css',
})
export class DashboardSummary {
  private portfolioService = inject(PortfolioService);

  selectedPortfolio = this.portfolioService.selectedPortfolio;
}
