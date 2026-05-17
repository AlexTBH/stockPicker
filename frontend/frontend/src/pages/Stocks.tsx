import { useState } from "react";
import { useGetStocksQuery, useGetPortfolioQuery, useBuyStockMutation, useSellStockMutation, } from "../store/extendedApi";

type Stock = {
  id: number;
  symbol: string;
  name: string;
  currentPrice: number;
};

export default function Stocks() {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [quantities, setQuantities] = useState<
    Record<string, number>
  >({});

  const { data: stocks = [], isLoading } =
    useGetStocksQuery();

  const { data: portfolio } = useGetPortfolioQuery();

  const [buyStock, { isLoading: buying }] =
    useBuyStockMutation();

  const [sellStock, { isLoading: selling }] =
    useSellStockMutation();

  const getHolding = (symbol: string) =>
    portfolio?.holdings?.find(
      (h: any) => h.symbol === symbol
    );

  const getOwnedQuantity = (symbol: string) =>
    getHolding(symbol)?.quantity ?? 0;

  const getQuantity = (symbol: string) =>
    quantities[symbol] ?? 1;

  const setQuantity = (
    symbol: string,
    value: number
  ) => {
    setQuantities((prev) => ({
      ...prev,
      [symbol]: value,
    }));
  };

  const getPnL = (stock: Stock) => {
    const holding = getHolding(stock.symbol);

    if (!holding?.avgBuyPrice) return 0;

    return (
      (stock.currentPrice -
        holding.avgBuyPrice) *
      holding.quantity
    );
  };

  const getPnLPercentage = (stock: Stock) => {
    const holding = getHolding(stock.symbol);

    if (!holding?.avgBuyPrice) return 0;

    return (
      ((stock.currentPrice -
        holding.avgBuyPrice) /
        holding.avgBuyPrice) *
      100
    );
  };

  const getColor = (value: number) => {
    if (value > 0) return "#22c55e";
    if (value < 0) return "#ef4444";
    return "#94a3b8";
  };

  const filteredStocks = stocks.filter(
    (stock: Stock) => {
      const q = search.toLowerCase();

      return (
        stock.symbol
          .toLowerCase()
          .includes(q) ||
        stock.name
          .toLowerCase()
          .includes(q)
      );
    }
  );

  const handleBuy = async (symbol: string) => {
    const quantity = getQuantity(symbol);

    try {
      await buyStock({
        symbol,
        quantity,
      }).unwrap();

      setMessage(
        `Bought ${quantity} ${symbol}`
      );

      setTimeout(() => setMessage(""), 2500);
    } catch {
      setMessage("Purchase failed");
    }
  };

  const handleSell = async (symbol: string) => {
    const quantity = getQuantity(symbol);

    try {
      await sellStock({
        symbol,
        quantity,
      }).unwrap();

      setMessage(
        `Sold ${quantity} ${symbol}`
      );

      setTimeout(() => setMessage(""), 2500);
    } catch {
      setMessage("Sale failed");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1
        style={{
          marginBottom: "20px",
          fontSize: "32px",
        }}
      >
        Stocks
      </h1>

      {message && (
        <div
          style={{
            background: "#1e293b",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "20px",
            border: "1px solid #334155",
          }}
        >
          {message}
        </div>
      )}

      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search stocks..."
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "30px",
          borderRadius: "10px",
          border: "1px solid #334155",
          background: "#1e293b",
          color: "white",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        {filteredStocks.map(
          (stock: Stock) => {
            const owned =
              getOwnedQuantity(
                stock.symbol
              );

            const pnl = getPnL(stock);
            const pnlPercent =
              getPnLPercentage(stock);

            const quantity =
              getQuantity(stock.symbol);

            return (
              <div
                key={stock.id}
                style={{
                  background: "#1e293b",
                  border:
                    "1px solid #334155",
                  borderRadius: "16px",
                  padding: "20px",
                }}
              >
                <h2>{stock.symbol}</h2>

                <p
                  style={{
                    color: "#94a3b8",
                    marginBottom: "15px",
                  }}
                >
                  {stock.name}
                </p>

                <p>
                  Price:
                  <strong>
                    $
                    {stock.currentPrice.toFixed(
                      2
                    )}
                  </strong>
                </p>

                <p>You own: {owned}</p>

                <p
                  style={{
                    color: getColor(pnl),
                    marginTop: "10px",
                    fontWeight: "bold",
                  }}
                >
                  PnL: ${pnl.toFixed(2)} (
                  {pnlPercent.toFixed(
                    2
                  )}
                  %)
                </p>

                <div
                  style={{
                    marginTop: "15px",
                    marginBottom: "10px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    Quantity
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        stock.symbol,
                        Number(
                          e.target.value
                        )
                      )
                    }
                    style={{
                      width: "100%",
                      marginTop: "5px",
                      padding: "8px",
                      borderRadius: "8px",
                      border:
                        "1px solid #334155",
                      background: "#0f172a",
                      color: "white",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    disabled={buying}
                    onClick={() =>
                      handleBuy(
                        stock.symbol
                      )
                    }
                    style={{
                      flex: 1,
                      background:
                        "#22c55e",
                      color: "white",
                    }}
                  >
                    {buying
                      ? "Buying..."
                      : "Buy"}
                  </button>

                  <button
                    disabled={
                      owned === 0 ||
                      selling
                    }
                    onClick={() =>
                      handleSell(
                        stock.symbol
                      )
                    }
                    style={{
                      flex: 1,
                      background:
                        "#ef4444",
                      color: "white",
                    }}
                  >
                    {selling
                      ? "Selling..."
                      : "Sell"}
                  </button>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}