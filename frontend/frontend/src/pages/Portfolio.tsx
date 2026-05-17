import { useGetPortfolioQuery } from "../store/extendedApi";

import PortfolioAllocation from "../components/PortfolioAllocation";
import PerformanceCards from "../components/PerformanceCards";
import HoldingCard from "../components/HoldingCard";

export default function Portfolio() {
  const { data: portfolio, isLoading } =
    useGetPortfolioQuery();

  if (isLoading) {
    return (
      <div className="container">
        Loading...
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="container">
        No portfolio
      </div>
    );
  }

  const holdings =
    portfolio.holdings ?? [];

  return (
    <div className="container">

      <h1>Portfolio</h1>

      <div className="dashboard-grid">

        <PortfolioAllocation
          holdings={holdings}
          cashBalance={
            portfolio.cashBalance
          }
        />

        <PerformanceCards
          holdings={holdings}
        />

      </div>

      <div className="holdings-grid">

        {holdings.map((h: any) => (
          <HoldingCard
            key={h.symbol}
            holding={h}
          />
        ))}

      </div>

    </div>
  );
}