import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Projects from './pages/Projects';
import Board from './pages/Board';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-logo">TaskFlow</div>
          <nav className="sidebar-nav">
            <NavLink to="/" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')} end>Projects</NavLink>
            <NavLink to="/login" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>Register</NavLink>
          </nav>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Projects />} />
            <Route path="/board/:id" element={<Board />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;