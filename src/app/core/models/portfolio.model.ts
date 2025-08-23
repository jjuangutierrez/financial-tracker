import { Transaction } from "./transaction.model";

export interface Portfolio {
    id: number;
    name: string;
    expenses: Transaction[];
    income: Transaction[];
    balance: number;
    createdAt: Date;
}