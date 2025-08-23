export interface Transaction {
    id: number;
    type: 'expense' | 'income';
    description: string;
    amount: number;
    date: Date;
}