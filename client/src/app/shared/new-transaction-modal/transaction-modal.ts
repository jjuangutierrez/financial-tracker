import { Component, Inject, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PortfolioSelectionService } from '../../core/services/portfolio-selection.service';
import { TransactionsService } from '../../core/services/transactions.service';
import { CommonModule } from '@angular/common';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-new-transaction-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-modal.html',
  styleUrl: './transaction-modal.css',
})
export class NewTransactionModal {
  private portfolioSelectionService = inject(PortfolioSelectionService);
  private transactionsService = inject(TransactionsService);
  private dialogRef = inject(DialogRef<NewTransactionModal>);

  transactionData = inject(DIALOG_DATA, { optional: true }) as any;

  initialFormData = {
    title: this.transactionData?.title || '',
    description: this.transactionData?.description || '',
    amount: this.transactionData?.amount || null,
    type: this.transactionData?.type || 'income',
    date: this.transactionData?.date || new Date().toISOString().split('T')[0],
  };

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    const selectedPortfolio = this.portfolioSelectionService.selectedPortfolio;
    if (!selectedPortfolio) {
      console.error('there are no portfolio selected');
      return;
    }

    const transaction = {
      ...form.value,
      portfolioId: selectedPortfolio.id,
    };

    if (this.transactionData?.id) {
      // Edit mode
      this.transactionsService.updateTransaction(this.transactionData.id, transaction);
    } else {
      // Create mode
      this.transactionsService.addTransaction(transaction);
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
