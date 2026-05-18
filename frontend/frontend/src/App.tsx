import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import Stocks from "./pages/Stocks";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transactions";
import Admin from "./admin/AdminPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

import { logout, setToken, setUser } from "./store/authSlice";
import { useRefreshMutation, useLogoutMutation } from "./store/authApi";
import { useGetPortfolioQuery } from "./store/extendedApi";
import { decodeToken } from "./auth/jwt";

import type { RootState } from "./store/store";

export default function App() {
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "Admin";

  console.log("user:", user);
console.log("isAdmin:", isAdmin);

  const [refresh] = useRefreshMutation();
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    const init = async () => {
      if (token) return;

      try {
        const result = await refresh().unwrap();
        dispatch(setToken(result.accessToken));
        const decoded = decodeToken(result.accessToken);
        dispatch(setUser({ email: decoded.name, role: decoded.role }));
      } catch {}
    };

    init();
  }, []);

  const { data: portfolio } = useGetPortfolioQuery(undefined, {
    skip: !token,
  });

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {}
    dispatch(logout());
  };

  const AdminRoute = () => {
    if (!isAdmin) return <Navigate to="/stocks" />;
    return <Admin />;
  };

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
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />

      <Routes>
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/stocks" />} />
      </Routes>
    </>
  );
}