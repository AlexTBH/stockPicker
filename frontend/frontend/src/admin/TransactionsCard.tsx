type Transaction = {
  transactionId: number;
  symbol: string;
  type: string;
  quantity: number;
  priceAtTransaction: number;
  totalAmount: number;
};

export default function TransactionsCard({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="card">
      <h2>Latest Transactions</h2>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {transactions.length === 0 && (
          <p style={{ color: "#94a3b8" }}>
            No transactions yet
          </p>
        )}

        {transactions.map((t) => (
          <div
            key={t.transactionId}
            style={{
              padding: 10,
              border: "1px solid #334155",
              borderRadius: 10,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{t.symbol}</strong>

              <span
                style={{
                  color:
                    t.type === "Buy"
                      ? "#22c55e"
                      : "#ef4444",
                  fontWeight: 600,
                }}
              >
                {t.type}
              </span>
            </div>

            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              Qty: {t.quantity} · $
              {t.priceAtTransaction.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}