import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('pomodoro_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const settings = (() => {
    const saved = localStorage.getItem('pomodoro_settings');
    return saved ? JSON.parse(saved) : {
      work: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
    };
  })();

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    const newSession = {
      id: Date.now(),
      mode,
      duration: settings[mode],
      completedAt: new Date(),
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem('pomodoro_sessions', JSON.stringify(updatedSessions));
    
    // Play sound notification
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings[mode]);
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(settings[newMode]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-12">Đồng hồ Pomodoro</h2>
      
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center w-full max-w-md">
        <div className="flex gap-4 mb-12 p-1 bg-gray-50 rounded-2xl">
          <button
            onClick={() => changeMode('work')}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === 'work' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Làm việc
          </button>
          <button
            onClick={() => changeMode('shortBreak')}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === 'shortBreak' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Nghỉ ngắn
          </button>
          <button
            onClick={() => changeMode('longBreak')}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === 'longBreak' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Nghỉ dài
          </button>
        </div>

        <div className="text-8xl font-black text-gray-800 mb-12 tabular-nums">
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-4">
          <button
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isActive 
                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200'
            }`}
          >
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          <button
            onClick={resetTimer}
            className="w-20 h-20 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-all"
          >
            <RotateCcw className="w-8 h-8" />
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Trạng thái</div>
            <div className="font-bold text-gray-800">
              {mode === 'work' ? 'Đang tập trung' : 'Đang nghỉ ngơi'}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Hoàn thành</div>
            <div className="font-bold text-gray-800">
              {sessions.filter(s => s.mode === 'work').length} phiên
            </div>
          </div>
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="mt-12 w-full max-w-2xl">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Lịch sử hôm nay</h3>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${session.mode === 'work' ? 'bg-primary-500' : 'bg-green-500'}`} />
                  <span className="text-gray-700 font-medium">
                    {session.mode === 'work' ? 'Làm việc' : 'Nghỉ ngơi'}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pomodoro;
