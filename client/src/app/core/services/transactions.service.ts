import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Transaction } from '../models/transaction';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadTransactions(portfolioId: number): void {
    this.http.get<any[]>(`${environment.apiUrl}/transaction/portfolio/${portfolioId}`)
      .subscribe({
        next: (data) => {
          const mapped = data.map(t => this.mapFromApi(t));
          this.transactionsSubject.next(mapped);
        },
        error: (err) => console.error('Error cargando transacciones:', err)
      });
  }

  addTransaction(transaction: Partial<Transaction>): void {
    this.http.post<any>(`${environment.apiUrl}/transaction`, this.mapToApi(transaction))
      .subscribe({
        next: (created) => {
          const mapped = this.mapFromApi(created);
          const current = this.transactionsSubject.value;
          this.transactionsSubject.next([...current, mapped]);
        },
        error: (err) => console.error('Error creando transacción:', err)
      });
  }

  deleteTransaction(transactionId: number): void {
    this.http.delete(`${environment.apiUrl}/transaction/${transactionId}`)
      .subscribe({
        next: () => {
          const current = this.transactionsSubject.value;
          const updated = current.filter(t => t.id !== transactionId);
          this.transactionsSubject.next(updated);
        },
        error: (err) => console.error('Error eliminando transacción:', err)
      });
  }

  updateTransaction(id: number, changes: Partial<Transaction>): void {
    this.http.patch<any>(`${environment.apiUrl}/transaction/${id}`, this.mapToApi(changes))
      .subscribe({
        next: (updated) => {
          const mapped = this.mapFromApi(updated);
          const current = this.transactionsSubject.value;
          const newList = current.map(t => t.id === id ? mapped : t);
          this.transactionsSubject.next(newList);
        },
        error: (err) => console.error('Error actualizando transacción:', err)
      });
  }

  clearTransactions(): void {
    this.transactionsSubject.next([]);
  }

  private mapFromApi(apiTx: any): Transaction {
    return {
      ...apiTx,
      type: apiTx.type === 0 ? 'income' : 'expense',
      date: apiTx.date ? new Date(apiTx.date).toISOString().split('T')[0] : ''
    };
  }

private mapToApi(tx: Partial<Transaction>): any {
    return {
      ...tx,
      type: tx.type === 'income' ? 0 : 1,
    };
  }
}