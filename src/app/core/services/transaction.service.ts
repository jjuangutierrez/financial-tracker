// core/services/transaction.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private idCounter = 1;
    private _transactions = signal<Transaction[]>([]);

    getAll() {
        return this._transactions;
    }

    getTransactionsByPortfolio(portfolioId: number) {
        return computed(() => 
            this._transactions().filter(t => t.portfolioId === portfolioId)
        );
    }

    getIncomesByPortfolio(portfolioId: number) {
        return computed(() => 
            this._transactions().filter(t => t.portfolioId === portfolioId && t.type === 'income')
        );
    }

    getExpensesByPortfolio(portfolioId: number) {
        return computed(() => 
            this._transactions().filter(t => t.portfolioId === portfolioId && t.type === 'expense')
        );
    }

    add(transaction: Transaction) {
        this.idCounter = Math.max(...this._transactions().map(t => t.id), 0) + 1;
        const newTx = { ...transaction, id: this.idCounter };
        this._transactions.update(list => [...list, newTx]);
        return newTx;
    }

    delete(id: number) {
        this._transactions.update(list => list.filter(t => t.id !== id));
    }

    deleteTransactionsByPortfolio(portfolioId: number) {
        this._transactions.update(list => list.filter(t => t.portfolioId !== portfolioId));
    }

    update(id: number, updates: Partial<Transaction>) {
        this._transactions.update(list => 
            list.map(t => t.id === id ? { ...t, ...updates } : t)
        );
    }
}