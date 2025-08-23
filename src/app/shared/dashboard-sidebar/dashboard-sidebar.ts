import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio.servie';
import { SidebarItem } from '../sidebar-item/sidebar-item';

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [SidebarItem],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.css'
})
export class DashboardSidebar {
    portfolioService = inject(PortfolioService);

    addPortfolio() {
      this.portfolioService.addPortfolio();
    }
}
