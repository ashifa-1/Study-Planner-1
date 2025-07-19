// ✅ TaskDashboard.js (Enhanced with Better UI and Status Updates)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TaskDashboard.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    deadline: '',
    notes: '',
    status: 'pending'
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('User data from /me:', res.data);  // <-- add this
      setUser(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ subject: '', deadline: '', notes: '', status: 'pending' });
      await fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchTasks();
      setEditingTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    await handleUpdateTask(task._id, { ...task, status: newStatus });
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    const today = new Date();
    const taskDate = new Date(deadline);
    return taskDate < today;
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const taskDate = new Date(deadline);
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchUser();
      fetchTasks();
    }
  }, []);

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="header-left">
          <h2>📚 Study Planner</h2>
          {user && <p className="greeting">Hello, {user.name.split(' ')[0]}!</p>}
        </div>
        <div className="header-right">
          <div className="task-stats">
            <span className="stat-item">
              <span className="stat-number">{pendingTasks.length}</span>
              <span className="stat-label">Pending</span>
            </span>
            <span className="stat-item">
              <span className="stat-number">{completedTasks.length}</span>
              <span className="stat-label">Completed</span>
            </span>
          </div>
          <div className="header-buttons">
            <Link to="/" className="home-button">
              🏠 Home
            </Link>
            <button className="logout-button" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>

        </div>
      </div>

      <form onSubmit={handleCreateTask} className="task-form">
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            type="text"
            placeholder="Enter subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>
          <input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            placeholder="Add notes (optional)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="pending">📋 Pending</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? '⏳ Adding...' : '➕ Add Task'}
        </button>
      </form>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      )}

      <div className="task-sections">
        {/* Pending Tasks Section */}
        {pendingTasks.length > 0 && (
          <div className="task-section">
            <h3 className="section-title">
              📋 Pending Tasks ({pendingTasks.length})
            </h3>
            <div className="task-list">
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteTask}
                  onEdit={setEditingTask}
                  isEditing={editingTask?._id === task._id}
                  onUpdate={handleUpdateTask}
                  formatDate={formatDate}
                  isOverdue={isOverdue}
                  getDaysUntilDeadline={getDaysUntilDeadline}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <div className="task-section">
            <h3 className="section-title">
              ✅ Completed Tasks ({completedTasks.length})
            </h3>
            <div className="task-list">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteTask}
                  onEdit={setEditingTask}
                  isEditing={editingTask?._id === task._id}
                  onUpdate={handleUpdateTask}
                  formatDate={formatDate}
                  isOverdue={isOverdue}
                  getDaysUntilDeadline={getDaysUntilDeadline}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {tasks.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No tasks yet!</h3>
            <p>Create your first study task to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Task Card Component
const TaskCard = ({
  task,
  onToggleStatus,
  onDelete,
  onEdit,
  isEditing,
  onUpdate,
  formatDate,
  isOverdue,
  getDaysUntilDeadline
}) => {
  const [editData, setEditData] = useState({
    subject: task.subject,
    deadline: task.deadline?.substring(0, 10) || '',
    notes: task.notes || '',
    status: task.status
  });

  const handleSaveEdit = () => {
    onUpdate(task._id, editData);
  };

  const handleCancelEdit = () => {
    onEdit(null);
    setEditData({
      subject: task.subject,
      deadline: task.deadline?.substring(0, 10) || '',
      notes: task.notes || '',
      status: task.status
    });
  };

  const daysUntil = getDaysUntilDeadline(task.deadline);
  const overdue = isOverdue(task.deadline);

  if (isEditing) {
    return (
      <div className="task-card editing">
        <div className="edit-form">
          <input
            type="text"
            value={editData.subject}
            onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
            className="edit-input"
          />
          <input
            type="date"
            value={editData.deadline}
            onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
            className="edit-input"
          />
          <textarea
            value={editData.notes}
            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
            className="edit-textarea"
            rows="2"
          />
          <select
            value={editData.status}
            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
            className="edit-select"
          >
            <option value="pending">📋 Pending</option>
            <option value="completed">✅ Completed</option>
          </select>
          <div className="edit-buttons">
            <button onClick={handleSaveEdit} className="save-button">
              💾 Save
            </button>
            <button onClick={handleCancelEdit} className="cancel-button">
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-card ${task.status} ${overdue && task.status === 'pending' ? 'overdue' : ''}`}>
      <div className="task-header">
        <h3 className="task-title">{task.subject}</h3>
        <div className="task-actions">
          <button
            onClick={() => onToggleStatus(task)}
            className={`status-toggle ${task.status}`}
            title={task.status === 'pending' ? 'Mark as completed' : 'Mark as pending'}
          >
            {task.status === 'pending' ? '⭕' : '✅'}
          </button>
          <button
            onClick={() => onEdit(task)}
            className="edit-button"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="delete-button"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="task-info">
        <div className="deadline-info">
          <span className="deadline-label">📅 Deadline:</span>
          <span className={`deadline-value ${overdue ? 'overdue' : ''}`}>
            {formatDate(task.deadline)}
          </span>
          {daysUntil !== null && task.status === 'pending' && (
            <span className={`days-until ${overdue ? 'overdue' : daysUntil <= 3 ? 'urgent' : ''}`}>
              {overdue
                ? `${Math.abs(daysUntil)} days overdue`
                : daysUntil === 0
                  ? 'Due today!'
                  : `${daysUntil} days left`
              }
            </span>
          )}
        </div>

        <div className="status-info">
          <span className="status-label">Status:</span>
          <span className={`status-badge ${task.status}`}>
            {task.status === 'pending' ? '📋 Pending' : '✅ Completed'}
          </span>
        </div>

        {task.notes && (
          <div className="notes-section">
            <span className="notes-label">📝 Notes:</span>
            <p className="notes-content">{task.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDashboard;