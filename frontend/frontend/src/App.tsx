import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Stocks from "./pages/Stocks";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transactions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import { logout, setToken } from "./store/authSlice";
import { useRefreshMutation } from "./store/authApi";
import { useGetPortfolioQuery } from "./store/extendedApi";

import type { RootState } from "./store/store";

export default function App() {
  const dispatch = useDispatch();

  const token = useSelector(
    (state: RootState) => state.auth.token
  );

  const [refresh] = useRefreshMutation();

  useEffect(() => {
    const init = async () => {
      if (token) return;

      try {
        const result = await refresh().unwrap();
        dispatch(setToken(result.accessToken));
      } catch {
      }
    };

    init();
  }, []);

  const { data: portfolio } = useGetPortfolioQuery(undefined, {
    skip: !token,
  });

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar
        cashBalance={portfolio?.cashBalance ?? 0}
        totalValue={portfolio?.totalValue ?? 0}
        onLogout={() => dispatch(logout())}

      />

      <Routes>
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="*" element={<Navigate to="/stocks" />} />
      </Routes>
    </>
  );
}