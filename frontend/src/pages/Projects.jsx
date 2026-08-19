import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const teams = ['Frontend Lead', 'Backend Lead', 'DevOps Lead', 'AI Engineer Lead', 'QA Lead'];
const teamColors = {
  'Frontend Lead': '#3b82f6',
  'Backend Lead': '#10b981',
  'DevOps Lead': '#f59e0b',
  'AI Engineer Lead': '#a855f7',
  'QA Lead': '#ef4444'
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTeam, setAssignedTeam] = useState('Frontend Lead');
  const [dueDate, setDueDate] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const isCEO = user?.role === 'CEO';

  const loadProjects = () => {
    if (!user) return;
    const url = isCEO
      ? `http://localhost:5002/api/projects/owner/${user.id}`
      : `http://localhost:5002/api/projects/team/${user.role}`;
    axios.get(url).then(res => setProjects(res.data));
  };

  useEffect(() => { loadProjects(); }, []);

  const createProject = async () => {
    if (!name.trim()) return;
    await axios.post('http://localhost:5002/api/projects', {
      name, description, owner: user.id, assignedTeam, dueDate
    });
    setName(''); setDescription(''); setDueDate('');
    loadProjects();
  };

  const updateStatus = async (projectId, status) => {
    await axios.put(`http://localhost:5002/api/projects/${projectId}/status`, { status });
    loadProjects();
  };

  if (!user) return <p>Please login to view your dashboard.</p>;

  return (
    <div>
      <h2 className="page-title">{isCEO ? 'Codex — All Projects' : `${user.role} Dashboard`}</h2>

      {isCEO && (
        <div className="post-composer" style={{ flexDirection: 'column' }}>
          <input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: '10px' }} />
          <textarea placeholder="Project brief for the team..." value={description} onChange={(e) => setDescription(e.target.value)} />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            <select value={assignedTeam} onChange={(e) => setAssignedTeam(e.target.value)} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #262626', background: '#0a0a0a', color: '#fff' }}>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ marginBottom: 0, width: 'auto' }} />
          </div>
          <div className="post-composer-footer">
            <button className="post-btn" onClick={createProject}>Assign Project</button>
          </div>
        </div>
      )}

      {projects.length === 0 && <p>No projects yet.</p>}

      <div className="product-grid">
        {projects.map(p => (
          <div key={p._id} className="post-card" style={{ flexDirection: 'column', borderLeft: `4px solid ${teamColors[p.assignedTeam] || '#3b82f6'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: teamColors[p.assignedTeam] || '#3b82f6', textTransform: 'uppercase' }}>{p.assignedTeam}</span>
              <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '999px', background: p.status === 'Completed' ? '#10b98130' : p.status === 'In Progress' ? '#f59e0b30' : '#26262680', color: p.status === 'Completed' ? '#10b981' : p.status === 'In Progress' ? '#f59e0b' : '#9ca3af' }}>
                {p.status}
              </span>
            </div>
            <Link to={`/board/${p._id}`} style={{ textDecoration: 'none' }}>
              <h3 className="post-author">{p.name}</h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>{p.description || 'No description'}</p>
            </Link>
            {p.dueDate && <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '10px' }}>📅 Due {new Date(p.dueDate).toLocaleDateString()}</p>}
            {!isCEO && (
              <select value={p.status} onChange={(e) => updateStatus(p._id, e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #262626', background: '#0a0a0a', color: '#fff', fontSize: '13px' }}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}