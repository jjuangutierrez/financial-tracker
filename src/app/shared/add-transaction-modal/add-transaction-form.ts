import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-add-transaction-modal',
  templateUrl: './add-transaction-form.html',
  styleUrls: ['./add-transaction-form.css'],
})
export class AddTransactionForm {
  description = signal('');
  amount = signal(0);

  @Input() showIncomesView!: () => boolean;

  @Output() addTransaction = new EventEmitter<{
    description: string;
    amount: number;
    type: 'income' | 'expense';
  }>();

  save() {
    const type = this.showIncomesView() ? 'income' : 'expense';

    this.addTransaction.emit({
      description: this.description(),
      amount: this.amount(),
      type,
    });

    this.description.set('');
    this.amount.set(0);
  }
}
