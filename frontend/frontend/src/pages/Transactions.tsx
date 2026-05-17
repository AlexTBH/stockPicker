import { useGetTransactionsQuery } from "../store/extendedApi";
import type { Transaction } from "../types/transaction";


export default function Transactions() {
  const {
    data: transactions = [],
    isLoading,
    error,
  } = useGetTransactionsQuery();

  const getColor = (type: string) => {
    if (type === "Buy") return "green";
    if (type === "Sell") return "red";
    return "black";
  };

  if (isLoading) return <p>Loading transactions...</p>;
  if (error) return <p style={{ color: "red" }}>Failed to load transactions</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Transactions</h1>

      <div style={{ display: "grid", gap: "10px" }}>
        {transactions.map((tx: Transaction) => (
          <div
            key={tx.transactionId}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <h3>{tx.symbol}</h3>

            <p style={{ color: getColor(tx.type) }}>
              Type: {tx.type}
            </p>

            <p>Quantity: {tx.quantity}</p>
            <p>Price: ${tx.priceAtTransaction}</p>
            <p>Total: ${tx.totalAmount}</p>

            <p style={{ fontSize: "12px", color: "#666" }}>
              {new Date(tx.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}