export type Transaction = {
  transactionId: number;
  symbol: string;
  type: string;
  quantity: number;
  priceAtTransaction: number;
  totalAmount: number;
  createdAt: string;
};