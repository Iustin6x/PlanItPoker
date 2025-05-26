import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/authProvider";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken, error } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/signup`,
        { name, email, password },
      );

      // Dacă vrei autologin după signup
      if (response.data.token) {
        setToken(response.data.token);
        navigate("/home");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
