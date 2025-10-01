import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PortfolioSelectionService } from '../../core/services/portfolio-selection.service';
import { TransactionsService } from '../../core/services/transactions.service';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';

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

    this.transactionsService.addTransaction(transaction);

    form.reset();

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
