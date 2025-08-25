// core/services/portfolio.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { Portfolio } from '../models/portfolio.model';
import { TransactionService } from './transaction.service';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private transactionService = inject(TransactionService);
  private idCounter = 1;
  
  portfolios = signal<Portfolio[]>([]);

  // Portfolio seleccionado actualmente
  selectedPortfolioId = signal<number>(1);

  // Portfolio activo
  selectedPortfolio = computed(() => 
    this.portfolios().find(p => p.id === this.selectedPortfolioId())
  );

  // Balance calculado desde las transacciones
  getPortfolioBalance = computed(() => {
    const transactions = this.transactionService.getTransactionsByPortfolio(this.selectedPortfolioId());
    return transactions().reduce((balance, tx) => {
      return tx.type === 'income' ? balance + tx.amount : balance - tx.amount;
    }, 0);
  });

  addPortfolio(name?: string) {
    this.idCounter = Math.max(...this.portfolios().map(p => p.id), 0) + 1;
    const newPortfolio: Portfolio = {
      id: this.idCounter,
      name: name || `Portfolio ${this.idCounter}`,
      createdAt: new Date(),
    };
    this.portfolios.update((portfolios) => [...portfolios, newPortfolio]);
    return newPortfolio;
  }

  deletePortfolio(portfolioId: number) {
    // No permitir eliminar si es el último portfolio
    if (this.portfolios().length <= 1) return;

    this.portfolios.update((portfolios) =>
      portfolios.filter((p) => p.id !== portfolioId)
    );

    // Si eliminamos el portfolio seleccionado, seleccionar otro
    if (this.selectedPortfolioId() === portfolioId) {
      const remaining = this.portfolios();
      if (remaining.length > 0) {
        this.selectedPortfolioId.set(remaining[0].id);
      }
    }

    // Eliminar transacciones del portfolio eliminado
    this.transactionService.deleteTransactionsByPortfolio(portfolioId);
  }

  renamePortfolio(portfolioId: number, newName: string) {
    this.portfolios.update((portfolios) =>
      portfolios.map((p) =>
        p.id === portfolioId ? { ...p, name: newName } : p
      )
    );
  }

  selectPortfolio(portfolioId: number) {
    this.selectedPortfolioId.set(portfolioId);
  }
}