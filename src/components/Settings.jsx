import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Bell } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pomodoro_settings');
    return saved ? JSON.parse(saved) : {
      work: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
    };
  });

  const [message, setMessage] = useState('');

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: parseInt(value) * 60 });
  };

  const handleSave = () => {
    localStorage.setItem('pomodoro_settings', JSON.stringify(settings));
    setMessage('Cài đặt đã được lưu thành công!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReset = () => {
    const defaultSettings = {
      work: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
    };
    setSettings(defaultSettings);
    localStorage.setItem('pomodoro_settings', JSON.stringify(defaultSettings));
    setMessage('Đã khôi phục cài đặt mặc định!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Cài đặt</h2>
        <p className="text-gray-500 mt-2">Tùy chỉnh ứng dụng theo nhu cầu của bạn.</p>
      </div>

      <div className="space-y-8">
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-500" />
            Thời gian Pomodoro (phút)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Làm việc</label>
              <input
                type="number"
                value={settings.work / 60}
                onChange={(e) => handleChange('work', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Nghỉ ngắn</label>
              <input
                type="number"
                value={settings.shortBreak / 60}
                onChange={(e) => handleChange('shortBreak', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Nghỉ dài</label>
              <input
                type="number"
                value={settings.longBreak / 60}
                onChange={(e) => handleChange('longBreak', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </section>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Lưu cài đặt
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Khôi phục mặc định
          </button>
        </div>

        {message && (
          <div className="bg-green-50 text-green-600 p-4 rounded-xl border border-green-100 text-center font-medium animate-fade-in">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
