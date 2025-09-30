import { Component, inject, OnInit } from '@angular/core';
import { PortfolioItem } from "../portfolio-item/portfolio-item";
import { Router } from '@angular/router';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [PortfolioItem, AsyncPipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  portfolioService = inject(PortfolioService);
  portfolios$ = this.portfolioService.portfolios$;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.portfolioService.loadPortfolios();
  }

  createPortfolio() {
    this.portfolioService.createPortfolio({
      portfolioName: 'new portfolio',
      description: 'description'
    });
  }

  logOut(): void {
    console.log('Logging out...');
    localStorage.removeItem('auth_token');

    this.router.navigate(['/home']);
  }
}
