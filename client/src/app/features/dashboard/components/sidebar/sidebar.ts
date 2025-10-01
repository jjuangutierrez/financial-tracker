import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { PortfolioItem } from '../portfolio-item/portfolio-item';
import { AsyncPipe } from '@angular/common';
import { Portfolio } from '../../../../core/models/portfolio';
import { PortfolioSelectionService } from '../../../../core/services/portfolio-selection.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  imports: [PortfolioItem, AsyncPipe],
})
export class Sidebar implements OnInit {
  portfolioService = inject(PortfolioService);
  portfolioSelectionService = inject(PortfolioSelectionService)
  portfolios$ = this.portfolioService.portfolios$;

  constructor(private router: Router) {}

  activeMenuId: number | null = null;

  setActiveMenu(id: number | null) {
    this.activeMenuId = id;
  }

  ngOnInit(): void {
    this.portfolioService.loadPortfolios();
  }

  createPortfolio() {
    this.portfolioService.createPortfolio({
      portfolioName: 'new portfolio',
      description: 'write description here...',
    });
  }

  onRename(event: { id: number; newName: string }): void {
    this.portfolioService.updatePortfolio(event.id, { portfolioName: event.newName });
  }

  deleteItem(portfolioId: number): void {
    this.portfolioService.deletePortfolio(portfolioId);
  }

  onSelectPortfolio(portfolio: Portfolio): void {
    console.log('Portafolio seleccionado:', portfolio);
    this.portfolioSelectionService.selectPortfolio(portfolio);
  }

  logOut(): void {
    console.log('Logging out...');
    localStorage.removeItem('auth_token');
    this.router.navigate(['/home']);
  }
}
