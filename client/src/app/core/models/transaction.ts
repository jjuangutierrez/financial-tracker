export interface Transaction {
    id: number;
    title: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    date: Date;
    portfolioId: number;
    createdAt: Date;
    updatedAt: Date;
}