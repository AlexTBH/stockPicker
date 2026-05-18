import { Link } from "react-router-dom";

type Props = {
  cashBalance: number;
  totalValue: number;
  onLogout: () => void;
  isAdmin: boolean;
};

export default function Navbar({
  cashBalance,
  totalValue,
  onLogout,
  isAdmin,
}: Props) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">📈 StockPicker</div>

        <div className="nav-links">
          <Link to="/stocks">Stocks</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/transactions">Transactions</Link>
          {isAdmin && <Link to="/admin">Admin</Link>}
        </div>
      </div>

      <div className="navbar-right">
        <div className="stat-card stat-green">
          Cash
          <div className="stat-value">${cashBalance.toFixed(2)}</div>
        </div>

        <div className="stat-card stat-blue">
          Total
          <div className="stat-value">${totalValue.toFixed(2)}</div>
        </div>

        <button className="btn btn-danger" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}