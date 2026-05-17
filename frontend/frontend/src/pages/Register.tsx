import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../store/authApi";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [register] = useRegisterMutation();

  const handleRegister = async () => {
    await register({ email, password }).unwrap();
    navigate("/login");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Register</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>
        Create account
      </button>
    </div>
  );
}