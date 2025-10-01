import { Component, inject } from '@angular/core';
import { PortfolioSelectionService } from '../../../../core/services/portfolio-selection.service';
import { TransactionsService } from '../../../../core/services/transactions.service';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { NewTransactionModal } from '../../../../shared/new-transaction-modal/transaction-modal';

@Component({
  selector: 'app-transaction-panel',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe],
  templateUrl: './transaction-panel.html',
  styleUrl: './transaction-panel.css',
})
export class TransactionPanel {
  portfolioSelectionService = inject(PortfolioSelectionService);
  transactionsService = inject(TransactionsService);
  dialog = inject(Dialog);

  transactions$ = this.transactionsService.transactions$;

  ngOnInit(): void {
    this.portfolioSelectionService.selectedPortfolio$.subscribe((portfolio) => {
      if (portfolio) {
        this.transactionsService.loadTransactions(portfolio.id);
      } else {
        this.transactionsService.clearTransactions();
      }
    });
  }

  onNewTransaction(): void {
        this.dialog.open(NewTransactionModal);

  }

  onEdit(transaction: any): void {
    // TODO: abrir modal con datos de la transacción
    console.log('Editar transacción:', transaction);
  }

  onDelete(transactionId: number): void {
    this.transactionsService.deleteTransaction(transactionId);
  }

  openModal(): void {
  }
}
