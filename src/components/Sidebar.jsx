import React from 'react';
import { LayoutDashboard, CheckSquare, Timer, Settings } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'tasks', icon: CheckSquare, label: 'Công việc' },
    { id: 'pomodoro', icon: Timer, label: 'Pomodoro' },
    { id: 'settings', icon: Settings, label: 'Cài đặt' },
  ];

  return (
    <div className="w-64 bg-white border-right border-gray-200 h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
          <Timer className="w-8 h-8" />
          <span>TimeMaster</span>
        </h1>
      </div>
      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              activeTab === item.id
                ? 'bg-primary-50 text-primary-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
