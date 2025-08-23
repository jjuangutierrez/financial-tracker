import { inject, Injectable, signal } from '@angular/core';
import { Portfolio } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  portfolios = signal<Portfolio[]>([]);

  addPortfolio() {
    const id = this.portfolios().length + 1;
    const newPortfolio: Portfolio = {
      id,
      name: `portfolio ${id}`,
      balance: 0,
      expenses: [],
      income: [],
      createdAt: new Date(),
    };
    this.portfolios.update((portfolios) => [...portfolios, newPortfolio]);
  }

  deletePortfolio(portfolioId: number) {
    this.portfolios.update((portfolios) =>
      portfolios.filter((p) => p.id !== portfolioId)
    );
  }

  renamePortfolio(portfolioId: number, newName: string) {
    this.portfolios.update((portfolios) =>
      portfolios.map((p) =>
        p.id === portfolioId ? { ...p, name: newName } : p
      )
    );
  }
}
