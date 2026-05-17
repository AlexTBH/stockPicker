import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  holdings: {
    symbol: string;
    totalValue: number;
  }[];

  cashBalance: number;
};

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export default function PortfolioAllocation({
  holdings,
  cashBalance,
}: Props) {
  const data = [
    ...holdings.map((h) => ({
      name: h.symbol,
      value: h.totalValue,
    })),
    {
      name: "Cash",
      value: cashBalance,
    },
  ];

  return (
    <div className="card">
      <h3 style={{ marginBottom: "16px" }}>
        Portfolio Allocation
      </h3>

      <div style={{ height: "300px" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={100}
              label={({name,percent}) =>
                `${name} ${(percent!*100).toFixed(0)}%`
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}