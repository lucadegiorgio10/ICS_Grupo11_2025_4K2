export interface Transaction {
    id: string;
    email: string;
    visitDate: string;
    ticketCount: number;
    ticketType: string;
    paymentMethod: string;
    totalAmount: number;
    reservationCode?: string;
    ts: string;
}

export const transactionService = {
    saveTransaction: (transaction: Omit<Transaction, 'id'>) => {
        const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');

        const newTransaction: Transaction = {
            ...transaction,
            id: crypto.randomUUID(),
        };

        transactions.push(newTransaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        return newTransaction;
    },

    getAllTransactions: (): Transaction[] => {
        return JSON.parse(localStorage.getItem('transactions') || '[]');
    }
};
