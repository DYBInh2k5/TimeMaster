import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Clock, CheckSquare } from 'lucide-react';

const TaskList = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      { 
        id: Date.now(), 
        text: newTask, 
        completed: false, 
        priority: priority,
        createdAt: new Date() 
      },
    ]);
    setNewTask('');
    setPriority('medium');
  };

  const priorities = {
    high: { label: 'Cao', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    medium: { label: 'Vừa', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    low: { label: 'Thấp', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Danh sách công việc</h2>
        <div className="text-sm text-gray-500">
          {tasks.filter(t => !t.completed).length} việc cần làm
        </div>
      </div>

      <form onSubmit={addTask} className="flex flex-col gap-3 mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Thêm công việc mới..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 flex items-center gap-2 font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Ưu tiên:</span>
          {Object.entries(priorities).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPriority(key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                priority === key
                  ? `${value.bg} ${value.color} ${value.border} ring-2 ring-offset-1 ring-primary-100`
                  : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>
      </form>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Chưa có công việc nào. Hãy thêm công việc mới!</p>
          </div>
        ) : (
          tasks
            .sort((a, b) => {
              if (a.completed !== b.completed) return a.completed ? 1 : -1;
              const pOrder = { high: 0, medium: 1, low: 2 };
              if (a.priority !== b.priority) return pOrder[a.priority || 'medium'] - pOrder[b.priority || 'medium'];
              return b.id - a.id;
            })
            .map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  task.completed
                    ? 'bg-gray-50 border-gray-100'
                    : 'bg-white border-gray-200 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`transition-colors ${
                    task.completed ? 'text-green-500' : 'text-gray-300 hover:text-primary-500'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <div className="flex-1 flex flex-col">
                  <span
                    className={`text-lg ${
                      task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}
                  >
                    {task.text}
                  </span>
                  {!task.completed && (
                    <div className="flex gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${priorities[task.priority || 'medium'].bg} ${priorities[task.priority || 'medium'].color} border ${priorities[task.priority || 'medium'].border}`}>
                        {priorities[task.priority || 'medium'].label}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
