// shared/dashboard-transaction/dashboard-transaction.ts
import { Component, inject, signal, computed, model } from "@angular/core";
import { Transaction } from "../../core/models/transaction.model";
import { TransactionService } from "../../core/services/transaction.service";
import { PortfolioService } from "../../core/services/portfolio.servie";
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-dashboard-transaction",
  templateUrl: "./dashboard-transaction.html",
  styleUrls: ["./dashboard-transaction.css"],
  imports: [CommonModule, FormsModule]
})
export class DashboardTransaction {
  description = model('');
  amount = model(0);

  private transactionService = inject(TransactionService);
  private portfolioService = inject(PortfolioService);

  selectedPortfolio = this.portfolioService.selectedPortfolio;
  selectedPortfolioId = this.portfolioService.selectedPortfolioId;
  portfolios = this.portfolioService.portfolios;
  balance = this.portfolioService.getPortfolioBalance;

  transactions = computed(() => 
    this.transactionService.getTransactionsByPortfolio(this.selectedPortfolioId())()
  );
  
  incomes = computed(() => 
    this.transactionService.getIncomesByPortfolio(this.selectedPortfolioId())()
  );
  
  expenses = computed(() => 
    this.transactionService.getExpensesByPortfolio(this.selectedPortfolioId())()
  );

  showIncomesView = signal(true);

  addNewTransaction(type: 'income' | 'expense') {
    if (!this.description().trim() || this.amount() <= 0) {
      console.warn('Por favor completa todos los campos con valores válidos');
      return;
    }

    const newTx: Transaction = {
      id: 0,
      portfolioId: this.selectedPortfolioId(),
      type,
      description: this.description().trim(),
      amount: this.amount(),
      date: new Date()
    };

    this.transactionService.add(newTx);
    
    this.clearForm();
  }

  private clearForm() {
    this.description.set('');
    this.amount.set(0);
  }

  deleteTransaction(id: number) {
    this.transactionService.delete(id);
  }

  selectPortfolio(portfolioId: number) {
    this.portfolioService.selectPortfolio(portfolioId);
  }

  addNewPortfolio() {
    const portfolio = this.portfolioService.addPortfolio();
    this.portfolioService.selectPortfolio(portfolio.id);
  }

  showIncomes() {
    this.showIncomesView.set(true);
  }

  showExpenses() {
    this.showIncomesView.set(false);
  }
}