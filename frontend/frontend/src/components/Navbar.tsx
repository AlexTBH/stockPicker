import { Link } from "react-router-dom";
import { useLogoutMutation } from "../store/authApi";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../store/authSlice";

type Props = {
  cashBalance: number;
  totalValue: number;
};

export default function Navbar({
  cashBalance,
  totalValue,
}: Props) {
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.log("logout failed", err);
    }

    dispatch(logoutAction());
  };

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <div className="logo">📈 StockPicker</div>

        <div className="nav-links">
          <Link to="/stocks">Stocks</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/transactions">Transactions</Link>
        </div>
      </div>

      <div className="navbar-right">

        <div className="stat-card stat-green">
          Cash
          <div className="stat-value">
            ${cashBalance.toFixed(2)}
          </div>
        </div>

        <div className="stat-card stat-blue">
          Total
          <div className="stat-value">
            ${totalValue.toFixed(2)}
          </div>
        </div>

        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>

      </div>

    </nav>
  );
}