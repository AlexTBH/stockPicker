import { useState } from "react";
import { useGetTransactionsQuery } from "../store/extendedApi";
import type { Transaction } from "../types/transaction";

export default function Transactions() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    error,
  } = useGetTransactionsQuery({
    page,
    pageSize: 10,
  });

  const transactions = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="container">
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p style={{ color: "var(--red)" }}>
          Failed to load transactions
        </p>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="container">
        <h1 style={{ marginBottom: "24px", fontSize: "32px" }}>
          Transactions
        </h1>

        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "12px",
            }}
          >
            📊
          </div>

          <h2 style={{ marginBottom: "8px" }}>
            No transactions yet
          </h2>

          <p style={{ color: "var(--muted)" }}>
            Start trading stocks to see your activity here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">

      <h1
        style={{
          marginBottom: "24px",
          fontSize: "32px",
        }}
      >
        Transactions
      </h1>

      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        {transactions.map(
          (tx: Transaction) => {

            const isBuy =
              tx.type === "Buy";

            return (
              <div
                key={tx.transactionId}
                className="card"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <h2>{tx.symbol}</h2>

                    <p
                      style={{
                        color:
                          "var(--muted)",
                        fontSize: "12px",
                      }}
                    >
                      {new Date(
                        tx.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span
                    style={{
                      padding:
                        "6px 12px",
                      borderRadius:
                        "999px",
                      fontWeight: 700,

                      background:
                        isBuy
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(239,68,68,0.15)",

                      color: isBuy
                        ? "var(--green)"
                        : "var(--red)",
                    }}
                  >
                    {tx.type}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(3,1fr)",
                    gap: "14px",
                  }}
                >
                  <Stat
                    label="Quantity"
                    value={tx.quantity}
                  />

                  <Stat
                    label="Price"
                    value={`$${tx.priceAtTransaction.toFixed(
                      2
                    )}`}
                  />

                  <Stat
                    label="Total"
                    value={`$${tx.totalAmount.toFixed(
                      2
                    )}`}
                  />
                </div>
              </div>
            );
          }
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "30px",
          alignItems: "center",
        }}
      >
        <button
          className="btn"
          disabled={page === 1}
          onClick={() =>
            setPage((p) => p - 1)
          }
        >
          ← Previous
        </button>

        <span>
          Page {data?.currentPage}
          {" / "}
          {data?.totalPages}
        </span>

        <button
          className="btn"
          disabled={
            page === data?.totalPages
          }
          onClick={() =>
            setPage((p) => p + 1)
          }
        >
          Next →
        </button>
      </div>

    </div>
  );
}

type StatProps = {
  label: string;
  value: string | number;
};

function Stat({
  label,
  value,
}: StatProps) {
  return (
    <div
      style={{
        padding: "12px",
        background:
          "rgba(255,255,255,0.03)",
        borderRadius: "10px",
      }}
    >
      <p
        style={{
          color: "var(--muted)",
          fontSize: "12px",
          marginBottom: "6px",
        }}
      >
        {label}
      </p>

      <strong>{value}</strong>
    </div>
  );
}