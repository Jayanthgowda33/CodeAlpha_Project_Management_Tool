import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const roles = ['CEO', 'Frontend Lead', 'Backend Lead', 'DevOps Lead', 'AI Engineer Lead', 'QA Lead'];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Frontend Lead');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5002/api/auth/register', { name, email, password, role });
      alert('Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">📋</div>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Join Codex</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Name</label>
            <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="auth-field">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '13px 18px', borderRadius: '999px', border: '1px solid #262626', background: '#111111', color: '#fff', fontSize: '15px' }}>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" className="auth-button">Register</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}