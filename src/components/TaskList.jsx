import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Clock, CheckSquare } from 'lucide-react';

const TaskList = ({ tasks, setTasks }) => {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');

  const addTask = (e) => {
    e.preventDefault();
    const trimmedTask = newTask.trim();
    if (!trimmedTask) return;

    const newTaskObj = { 
      id: Date.now(), 
      text: trimmedTask, 
      completed: false, 
      priority: priority,
      createdAt: new Date().toISOString() 
    };

    setTasks(prev => [...prev, newTaskObj]);
    setNewTask('');
    setPriority('medium');
  };

  const priorities = {
    high: { label: 'Cao', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    medium: { label: 'Vừa', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    low: { label: 'Thấp', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa công việc này?')) {
      setTasks(prev => prev.filter((task) => task.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Danh sách công việc</h2>
        <div className="text-sm text-gray-500">
          {tasks.filter(t => !t.completed).length} việc cần làm
        </div>
      </div>

      <form onSubmit={addTask} className="flex flex-col gap-4 mb-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nhập công việc mới và nhấn Enter..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-gray-700"
            autoFocus
          />
          <button
            type="submit"
            className="bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 flex items-center gap-2 font-bold shadow-lg shadow-primary-100 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            THÊM
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Mức độ ưu tiên:</span>
          <div className="flex gap-2">
            {Object.entries(priorities).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPriority(key)}
                className={`px-5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  priority === key
                    ? `${value.bg} ${value.color} ${value.border} ring-2 ring-offset-1 ring-primary-100`
                    : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                }`}
              >
                {value.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </form>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <CheckSquare className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <p className="text-gray-400 font-medium text-lg">Hôm nay bạn cần làm gì?</p>
            <p className="text-gray-300 text-sm mt-1">Hãy thêm công việc đầu tiên của bạn</p>
          </div>
        ) : (
          [...tasks]
            .sort((a, b) => {
              if (a.completed !== b.completed) return a.completed ? 1 : -1;
              const pOrder = { high: 0, medium: 1, low: 2 };
              return pOrder[a.priority || 'medium'] - pOrder[b.priority || 'medium'];
            })
            .map((task) => (
              <div
                key={task.id}
                className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                  task.completed
                    ? 'bg-gray-50/50 border-gray-100 opacity-75'
                    : 'bg-white border-gray-100 hover:border-primary-100 hover:shadow-xl hover:shadow-gray-100'
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`transition-all transform hover:scale-110 ${
                    task.completed ? 'text-green-500' : 'text-gray-300 hover:text-primary-500'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle className="w-7 h-7" />
                  ) : (
                    <Circle className="w-7 h-7" />
                  )}
                </button>
                <div className="flex-1 flex flex-col">
                  <span
                    className={`text-lg font-medium ${
                      task.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                    }`}
                  >
                    {task.text}
                  </span>
                  {!task.completed && (
                    <div className="flex gap-2 mt-1.5">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest ${priorities[task.priority || 'medium'].bg} ${priorities[task.priority || 'medium'].color} border ${priorities[task.priority || 'medium'].border}`}>
                        {priorities[task.priority || 'medium'].label}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-200 hover:text-red-500 transition-all p-2 group-hover:opacity-100"
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
