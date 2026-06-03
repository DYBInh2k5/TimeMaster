import React from 'react';
import { CheckCircle2, Clock, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = ({ tasks }) => {
  const getSessions = () => {
    try {
      const saved = localStorage.getItem('pomodoro_sessions');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const sessions = getSessions();
  
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  
  const totalWorkMinutes = sessions
    .filter(s => s.mode === 'work')
    .reduce((acc, s) => acc + (s.duration / 60), 0);

  const stats = [
    { label: 'Hoàn thành', value: completedTasks, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Đang chờ', value: pendingTasks, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Tập trung', value: `${Math.round(totalWorkMinutes)}m`, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Phiên Pomo', value: sessions.filter(s => s.mode === 'work').length, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Chào buổi sáng!</h2>
        <p className="text-gray-500 mt-2">Dưới đây là tổng quan về thời gian và công việc của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Công việc gần đây</h3>
          <div className="space-y-4">
            {tasks.slice(-4).reverse().map((task) => (
              <div key={task.id} className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`flex-1 ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {task.text}
                </span>
              </div>
            ))}
            {tasks.length === 0 && <p className="text-gray-400 text-sm">Chưa có công việc nào gần đây.</p>}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Mẹo tăng năng suất</h3>
          <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
            <p className="text-primary-800 text-sm leading-relaxed">
              "Hãy thử kỹ thuật Pomodoro: 25 phút tập trung cao độ và 5 phút nghỉ ngơi để duy trì sự tỉnh táo suốt cả ngày."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
