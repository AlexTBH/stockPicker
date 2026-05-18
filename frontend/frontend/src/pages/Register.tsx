import { useState } from "react";
import { useRegisterMutation } from "../store/authApi";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [register, { isLoading }] =
    useRegisterMutation();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await register({
        name,
        email,
        password,
      }).unwrap();

      setSuccess("Account created!");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err: any) {
      setError(
        err?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="auth-container">

      <form className="auth-card" onSubmit={handleSubmit}>

        <h1>Register</h1>

        {/* NAME FIELD */}
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        {/* EMAIL FIELD */}
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        {/* PASSWORD FIELD */}
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        {error && (
          <div className="error">{error}</div>
        )}

        {success && (
          <div
            style={{
              background: "rgba(34,197,94,0.15)",
              border: "1px solid rgba(34,197,94,0.3)",
              color: "#86efac",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {success}
          </div>
        )}

        <button
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading
            ? "Creating account..."
            : "Register"}
        </button>

        <div style={{ textAlign: "center", marginTop: 10 }}>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Already have an account?
          </p>

          <Link
            to="/login"
            style={{
              color: "var(--blue)",
              fontWeight: 600,
            }}
          >
            Login here
          </Link>
        </div>

      </form>

    </div>
  );
}