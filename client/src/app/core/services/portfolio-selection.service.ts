import { Injectable } from "@angular/core";
import { Portfolio } from "../models/portfolio";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PortfolioSelectionService {
  private selectedPortfolioSubject = new BehaviorSubject<Portfolio | null>(null);
  selectedPortfolio$ = this.selectedPortfolioSubject.asObservable();

  get selectedPortfolio(): Portfolio | null {
    return this.selectedPortfolioSubject.value;
  }

  selectPortfolio(portfolio: Portfolio): void {
    this.selectedPortfolioSubject.next(portfolio);
  }

  clearSelection(): void {
    this.selectedPortfolioSubject.next(null);
  }
}
