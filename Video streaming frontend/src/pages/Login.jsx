import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
const navigate=useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const isEmail = identifier.includes('@');
    const requestBody = {
      email: isEmail ? identifier : "",
      username: !isEmail ? identifier : "",
      password: password
    };

    try {
      const response = await api.post('/users/login',requestBody);

      const { user, accessToken } = response.data.data;
      
      login(user, accessToken);
      alert("Logged in successfully!");
      if(response.status===200 ){
        navigate('/')
      }
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An authentication error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Stream your favorite content instantly</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="identifier">Username or Email</label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your username or email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}