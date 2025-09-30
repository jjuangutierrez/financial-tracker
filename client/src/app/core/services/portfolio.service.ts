import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Portfolio } from '../models/portfolio';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private portfoliosSubject = new BehaviorSubject<Portfolio[]>([]);
  portfolios$ = this.portfoliosSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadPortfolios(): void {
    this.http.get<Portfolio[]>(`${environment.apiUrl}/portfolio/me`)
      .subscribe({
        next: (data) => this.portfoliosSubject.next(data),
        error: (err) => console.error('Error cargando portfolios:', err)
      });
  }

  createPortfolio(portfolio: Partial<Portfolio>): void {
    this.http.post<Portfolio>(`${environment.apiUrl}/portfolio`, portfolio)
      .subscribe({
        next: (created) => {
          const current = this.portfoliosSubject.value;
          this.portfoliosSubject.next([...current, created]);
        },
        error: (err) => console.error('Error creando portfolio:', err)
      });
  }
}


