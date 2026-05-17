type Props = {
  holding: any;
};

export default function HoldingCard({ holding }: Props) {
  const quantity = holding.quantity ?? 0;
  const avgPrice = holding.avgBuyPrice ?? 0;
  const currentPrice = holding.currentPrice ?? 0;

  const value = quantity * currentPrice;
  const cost = quantity * avgPrice;

  const profit =
    holding.profitLoss ?? (value - cost);

  const profitPercent =
    cost ? (profit / cost) * 100 : 0;

  const isProfit = profit > 0;
  const isLoss = profit < 0;

  return (
    <div className="card">

      <h3>{holding.symbol}</h3>

      <div
        style={{
          fontSize: "18px",
          fontWeight: 800,
          color: isProfit
            ? "var(--green)"
            : isLoss
              ? "var(--red)"
              : "var(--muted)",
        }}
      >
        {profit > 0 ? "+" : ""}
        ${profit.toFixed(2)} (
        {profitPercent.toFixed(2)}%)
      </div>

      <div className="holding-row">
        <span>Quantity</span>
        <span>{quantity}</span>
      </div>

      <div className="holding-row">
        <span>Avg Buy</span>
        <span>${avgPrice.toFixed(2)}</span>
      </div>

      <div className="holding-row">
        <span>Current</span>
        <span>${currentPrice.toFixed(2)}</span>
      </div>

      <div className="holding-row">
        <strong>Value</strong>
        <strong>${value.toFixed(2)}</strong>
      </div>

    </div>
  );
}