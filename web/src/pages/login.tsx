import React, { useState } from 'react';

interface LoginProps {
  onLogin: (token: string, userId: number, email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
      const endpoint = isRegistering
        ? `${baseUrl}/signup`
        : `${baseUrl}/login`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Attempt to parse as JSON, but handle HTML error pages gracefully
      let data: any = {};
      try {
        data = await res.json();
      } catch (parseErr) {
        setError('Unexpected server response. Please try again.');
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isRegistering) {
        setIsRegistering(false);
        setPassword('');
        setSuccess('Account created! Please log in.');
      } else {
        onLogin(data.token, data.userId, email);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="mb-3">
        <input
          className="form-control mb-2"
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="username"
          required
          disabled={loading}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          value={password}
          autoComplete={isRegistering ? "new-password" : "current-password"}
          required
          disabled={loading}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {isRegistering ? 'Creating Account...' : 'Logging in...'}
            </>
          ) : (
            isRegistering ? 'Create Account' : 'Login'
          )}
        </button>
      </form>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="text-center mt-2">
        <button
          type="button"
          className="btn btn-link"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
            setSuccess('');
          }}
          disabled={loading}
        >
          {isRegistering
            ? 'Already have an account? Login'
            : 'Create Account'}
        </button>
      </div>
      <div className="text-muted small mt-2">
        {isRegistering
          ? "Create an account to save and share your naps."
          : "Log in to access your gear and locations."}
      </div>
    </div>
  );
};

export default Login;
