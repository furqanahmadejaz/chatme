import { useState } from "react";
import useLogin from "../hooks/useLogin";
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, isLoading, error } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(email, password);
    };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <label>Email: </label>
      <input
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>Password: </label>
      <input
        type="text"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button disabled={isLoading}>Login</button>
      <Link to="/signup" className="redirect-link">Don't have an account? Sign up</Link>
      {error && <div className="error">{error} </div>}
    </form>
  );
};

export default Login;