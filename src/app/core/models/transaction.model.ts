export interface Transaction {
  id: number;
  portfolioId: number;
  type: 'expense' | 'income';
  description: string;
  amount: number;
  date: Date;
}
