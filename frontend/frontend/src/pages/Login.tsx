import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/authApi";
import { useDispatch } from "react-redux";
import { setToken } from "../store/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const result = await login({ email, password }).unwrap();

    dispatch(setToken(result.accessToken));
    navigate("/stocks");

    navigate("/stocks");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}