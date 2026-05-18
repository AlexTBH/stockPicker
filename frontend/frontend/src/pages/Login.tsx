import { useState } from "react";
import { useLoginMutation } from "../store/authApi";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setToken, setUser } from "../store/authSlice";
import { decodeToken } from "../auth/jwt";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await login({ email, password }).unwrap();

      dispatch(setToken(result.accessToken));

      const decoded = decodeToken(result.accessToken);
      dispatch(setUser({ email: decoded.name, role: decoded.role }));

      if (decoded.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/portfolio");
      }
    } catch (err: any) {
      setError(err?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        {error && <div className="error">{error}</div>}

        <button className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div style={{ textAlign: "center", marginTop: 10 }}>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Don't have an account?
          </p>
          <Link to="/register" style={{ color: "var(--blue)", fontWeight: 600 }}>
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}