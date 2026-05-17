type Holding = {
  symbol: string;
  profitLoss: number;
};

type Props = {
  holdings: Holding[];
};

export default function PerformanceCards({
  holdings,
}: Props) {

  const sorted =
    [...holdings].sort(
      (a,b)=>
      b.profitLoss-a.profitLoss
    );

  const winner = sorted[0];
  const loser =
    sorted[sorted.length-1];

  return (
    <div
      style={{
        display:"flex",
        flexDirection:"column",
        gap:"16px"
      }}
    >
      <div className="card">
        <h3>Best</h3>

        <div
          style={{
            marginTop:"12px"
          }}
        >
          <div>
            {winner.symbol}
          </div>

          <div
            style={{
              color:"#22c55e",
              fontWeight:700
            }}
          >
            +$
            {winner.profitLoss.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Worst</h3>

        <div
          style={{
            marginTop:"12px"
          }}
        >
          <div>
            {loser.symbol}
          </div>

          <div
            style={{
              color:"#ef4444",
              fontWeight:700
            }}
          >
            $
            {loser.profitLoss.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}