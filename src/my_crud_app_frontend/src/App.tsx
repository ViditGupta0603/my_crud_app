import React, { useState, useEffect } from 'react';
import './App.css';
import { backend, Task, CreateTaskInput, UpdateTaskInput } from './backend';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState<CreateTaskInput>({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState<{ id: bigint; data: UpdateTaskInput } | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const result = await backend.get_all_tasks();
      setTasks(result as Task[]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setLoading(true);
    try {
      await backend.create_task(newTask);
      setNewTask({ title: '', description: '' });
      await fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: bigint, updates: UpdateTaskInput) => {
    setLoading(true);
    try {
      await backend.update_task(id, updates);
      await fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.delete_task(id);
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (task: Task) => {
    await updateTask(task.id, { completed: !task.completed });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ICP CRUD DApp</h1>
        <p>Task Management System</p>
      </header>

      <main className="App-main">
        {/* Create Task Form */}
        <section className="create-section">
          <h2>Create New Task</h2>
          <form onSubmit={createTask} className="task-form">
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows={3}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        </section>

        {/* Tasks List */}
        <section className="tasks-section">
          <h2>Tasks ({tasks.length})</h2>
          {loading && <p>Loading...</p>}
          
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task.id.toString()} className={`task-card ${task.completed ? 'completed' : ''}`}>
                {editingTask?.id === task.id ? (
                  // Edit Form
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editingTask.data.title || task.title}
                      onChange={(e) => setEditingTask({
                        ...editingTask,
                        data: { ...editingTask.data, title: e.target.value }
                      })}
                    />
                    <textarea
                      value={editingTask.data.description || task.description}
                      onChange={(e) => setEditingTask({
                        ...editingTask,
                        data: { ...editingTask.data, description: e.target.value }
                      })}
                      rows={3}
                    />
                    <div className="edit-actions">
                      <button onClick={() => updateTask(task.id, editingTask.data)}>
                        Save
                      </button>
                      <button onClick={() => setEditingTask(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Task Display
                  <div className="task-content">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <div className="task-meta">
                      <span>ID: {task.id.toString()}</span>
                      <span>Status: {task.completed ? 'Completed' : 'Pending'}</span>
                    </div>
                    <div className="task-actions">
                      <button 
                        onClick={() => toggleComplete(task)}
                        className={task.completed ? 'uncomplete' : 'complete'}
                      >
                        {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                      </button>
                      <button 
                        onClick={() => setEditingTask({ id: task.id, data: {} })}
                        className="edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;