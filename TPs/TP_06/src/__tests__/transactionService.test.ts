import { describe, it, expect, vi, beforeEach } from 'vitest';
import { transactionService, type Transaction } from '../services/transactionService';

const mockTransaction = {
  email: 'test@example.com',
  visitDate: '2025-09-20',
  ticketCount: 2,
  ticketType: 'regular',
  paymentMethod: 'cash',
  totalAmount: 10000,
  ts: new Date().toISOString()
};

describe('transactionService', () => {
  const mockStorage: { [key: string]: string } = {}

  beforeEach(() => {
    vi.resetModules()

    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn((key) => mockStorage[key] || null),
      setItem: vi.fn((key, value) => { mockStorage[key] = value }),
      clear: vi.fn(() => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]) })
    }
    vi.stubGlobal('localStorage', mockLocalStorage)
  })

  describe('guardar transacción', () => {
    it('debería guardar la transacción', () => {
      transactionService.saveTransaction(mockTransaction);

      const storedData = transactionService.getAllTransactions()

      const { id, ...storedDataWithoutId } = storedData[0];
      expect(storedDataWithoutId).toEqual(mockTransaction);
    });
  });

  describe('obtener transacciones', () => {
    it('debería devolver transacciones guardadas', () => {
      const mockData: Transaction[] = [
        { ...mockTransaction, id: 'test-id-1', ts: '2025-09-20T12:00:00Z' }
      ];
      localStorage.setItem('transactions', JSON.stringify(mockData));

      const transactions = transactionService.getAllTransactions();
      expect(transactions).toEqual(mockData);
    });
  });
});
