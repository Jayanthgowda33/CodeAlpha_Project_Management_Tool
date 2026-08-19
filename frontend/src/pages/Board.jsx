import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { DndContext } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';

const columns = ['To Do', 'In Progress', 'Done'];
const socket = io('http://localhost:5002');

function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task._id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 10 } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="task-card"
    >
      <p style={{ fontWeight: 600, fontSize: '14px' }}>{task.title}</p>
      {task.assignee && <p style={{ fontSize: '12px', color: '#9ca3af' }}>👤 {task.assignee.name}</p>}
      {task.comments.length > 0 && <p style={{ fontSize: '12px', color: '#9ca3af' }}>💬 {task.comments.length}</p>}
    </div>
  );
}

function Column({ column, tasks, onCardClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: column });
  return (
    <div ref={setNodeRef} className="kanban-column" style={{ background: isOver ? '#1a1a1a' : '#111111' }}>
      <h3 className="kanban-column-title">{column} ({tasks.length})</h3>
      {tasks.map(t => <TaskCard key={t._id} task={t} onClick={() => onCardClick(t)} />)}
    </div>
  );
}

export default function Board() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const loadTasks = () => {
    axios.get(`http://localhost:5002/api/tasks/project/${id}`)
      .then(res => setTasks(res.data));
  };

  useEffect(() => {
    loadTasks();
    socket.on('task-updated', () => loadTasks());
    return () => socket.off('task-updated');
  }, [id]);

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    await axios.post('http://localhost:5002/api/tasks', {
      project: id, title: newTaskTitle, column: 'To Do'
    });
    setNewTaskTitle('');
    loadTasks();
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id;
    const newColumn = over.id;
    if (!columns.includes(newColumn)) return;
    await axios.put(`http://localhost:5002/api/tasks/${taskId}/move`, { column: newColumn });
    loadTasks();
  };

  const addComment = async () => {
    if (!commentInput.trim() || !selectedTask) return;
    await axios.post(`http://localhost:5002/api/tasks/${selectedTask._id}/comment`, {
      userId: user.id, text: commentInput
    });
    setCommentInput('');
    const res = await axios.get(`http://localhost:5002/api/tasks/project/${id}`);
    setTasks(res.data);
    setSelectedTask(res.data.find(t => t._id === selectedTask._id));
  };

  return (
    <div>
      <h2 className="page-title">Board</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input placeholder="New task title..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} style={{ flex: 1, marginBottom: 0 }} />
        <button className="post-btn" onClick={addTask}>Add Task</button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {columns.map(col => (
            <Column
              key={col}
              column={col}
              tasks={tasks.filter(t => t.column === col)}
              onCardClick={setSelectedTask}
            />
          ))}
        </div>
      </DndContext>

      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '12px' }}>{selectedTask.title}</h3>
            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>{selectedTask.description || 'No description'}</p>

            <p style={{ fontWeight: 700, marginBottom: '8px' }}>Comments</p>
            {selectedTask.comments.map((c, i) => (
              <div key={i} className="comment-row">
                <div className="comment-text"><strong>{c.author?.name || 'User'}</strong> {c.text}</div>
              </div>
            ))}

            <div className="comment-input-row">
              <input placeholder="Add a comment..." value={commentInput} onChange={(e) => setCommentInput(e.target.value)} />
              <button className="comment-send" onClick={addComment}>Send</button>
            </div>

            <button className="post-btn" style={{ marginTop: '16px', background: '#262626' }} onClick={() => setSelectedTask(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}