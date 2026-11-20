// src/pages/Settings.jsx
import React, { useState, useRef } from 'react';
import {
  Timer,
  Bell,
  Volume2,
  Palette,
  Target,
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Sparkles,
  CheckCircle2,
  Sun,
  Moon,
  Play,
  Square
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendBrowserNotification
} from '../utils/notifications';
import { audioEngine } from '../utils/audioEngine';

export default function Settings() {
  const {
    settings,
    setSettings,
    theme,
    setTheme,
    handleExportData,
    handleImportData,
    loadDemoData,
    clearAllData,
    showToast,
    isAmbientPlaying,
    ambientType,
    changeAmbientType,
    toggleAmbientSound,
    ambientVolume,
    changeAmbientVolume
  } = useApp();

  const fileInputRef = useRef(null);
  const [notificationPerm, setNotificationPerm] = useState(getNotificationPermission);

  const ambientOptions = [
    { id: 'rain', label: '🌧️ Rain & Distant Thunder' },
    { id: 'forest', label: '🌲 Forest Birds & Breeze' },
    { id: 'cafe', label: '☕ Cozy Cafe Ambience' },
    { id: 'binaural', label: '🧘 40Hz Focus Beats & Drone' },
    { id: 'brown', label: '🌌 Cosmic Brown Noise' }
  ];

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleRequestNotification = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPerm(getNotificationPermission());
    if (granted) {
      handleSettingChange('notificationEnabled', true);
      sendBrowserNotification('FocusFlow Notifications Enabled! 🚀', {
        body: 'You will now receive alerts when your sessions and breaks complete.'
      });
      showToast('Notifications successfully enabled!', 'success');
    } else {
      showToast('Notification permission was not granted.', 'error');
    }
  };

  const handleTestSound = () => {
    audioEngine.playChime(settings.soundType || 'zen', settings.soundVolume || 0.7);
    showToast(`Testing ${settings.soundType || 'zen'} chime`, 'info');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        handleImportData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearSampleConfirm = () => {
    if (window.confirm('Clear all sample tasks, sessions, and streaks to start completely fresh?')) {
      clearAllData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize timers, procedural audio soundscapes, daily targets, and manage sample data
        </p>
      </div>

      {/* 1. Timer Durations & Automation */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/60 border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Timer className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold tracking-tight">Timer Intervals & Durations</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Focus Work (min)
            </label>
            <input
              type="number"
              min="1"
              max="90"
              value={settings.workDuration || 25}
              onChange={(e) => handleSettingChange('workDuration', Math.max(1, Number(e.target.value)))}
              className={`w-full px-3 py-2 rounded-xl border text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Short Break (min)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.shortBreakDuration || 5}
              onChange={(e) => handleSettingChange('shortBreakDuration', Math.max(1, Number(e.target.value)))}
              className={`w-full px-3 py-2 rounded-xl border text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Long Break (min)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.longBreakDuration || 15}
              onChange={(e) => handleSettingChange('longBreakDuration', Math.max(1, Number(e.target.value)))}
              className={`w-full px-3 py-2 rounded-xl border text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Long Break Interval
            </label>
            <input
              type="number"
              min="2"
              max="8"
              value={settings.longBreakInterval || 4}
              onChange={(e) => handleSettingChange('longBreakInterval', Math.max(2, Number(e.target.value)))}
              className={`w-full px-3 py-2 rounded-xl border text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Auto Transition Toggles */}
        <div className="mt-5 pt-4 border-t border-inherit grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3 rounded-xl border border-inherit cursor-pointer hover:bg-slate-800/20">
            <div>
              <span className="text-xs font-semibold block">Auto-start Breaks</span>
              <span className="text-[11px] text-slate-400">Begin break timer automatically when focus ends</span>
            </div>
            <input
              type="checkbox"
              checked={Boolean(settings.autoStartBreaks)}
              onChange={(e) => handleSettingChange('autoStartBreaks', e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-inherit cursor-pointer hover:bg-slate-800/20">
            <div>
              <span className="text-xs font-semibold block">Auto-start Work Sessions</span>
              <span className="text-[11px] text-slate-400">Begin focus session automatically when break ends</span>
            </div>
            <input
              type="checkbox"
              checked={Boolean(settings.autoStartWork)}
              onChange={(e) => handleSettingChange('autoStartWork', e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 2. Procedural Ambient Audio Studio */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/60 border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold tracking-tight">Procedural Ambient Soundscapes (100% Offline)</h3>
          </div>
          <button
            onClick={toggleAmbientSound}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isAmbientPlaying
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isAmbientPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Playing</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Selected Sound</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Synthesized directly in your browser using the HTML5 Web Audio API. Each soundscape has its own unique acoustic profile:
        </p>

        {/* Sound Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {ambientOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                changeAmbientType(opt.id);
                if (!isAmbientPlaying) toggleAmbientSound();
              }}
              className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                ambientType === opt.id
                  ? 'bg-purple-500/15 border-purple-500 text-purple-200 shadow-sm'
                  : 'border-inherit bg-slate-800/30 text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{opt.label}</span>
              {ambientType === opt.id && isAmbientPlaying && (
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              )}
            </button>
          ))}
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-4 pt-3 border-t border-inherit">
          <span className="text-xs text-slate-400 shrink-0">Master Ambient Volume:</span>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={ambientVolume}
            onChange={(e) => changeAmbientVolume(parseFloat(e.target.value))}
            className="flex-1 accent-purple-500 cursor-pointer"
          />
          <span className="font-mono text-xs font-bold text-purple-400 w-12 text-right">
            {Math.round(ambientVolume * 100)}%
          </span>
        </div>
      </div>

      {/* 3. Audio Chimes & Browser Notifications */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/60 border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold tracking-tight">Completion Chimes & Notifications</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sound Alerts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold block">Session Finish Chime</span>
                <span className="text-[11px] text-slate-400">Play chime when focus or break concludes</span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(settings.soundEnabled)}
                onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            {settings.soundEnabled && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Chime Tone
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={settings.soundType || 'zen'}
                      onChange={(e) => handleSettingChange('soundType', e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="zen">Zen Singing Bowl</option>
                      <option value="digital">Digital Arpeggio</option>
                      <option value="gong">Resonant Temple Gong</option>
                      <option value="marimba">Wooden Marimba</option>
                    </select>

                    <button
                      onClick={handleTestSound}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-colors"
                    >
                      Test
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Alert Volume</span>
                    <span className="font-mono">{Math.round((settings.soundVolume || 0.7) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={settings.soundVolume || 0.7}
                    onChange={(e) => handleSettingChange('soundVolume', parseFloat(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Browser Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold block">Desktop Notifications</span>
                <span className="text-[11px] text-slate-400">Receive alert when tab is in background</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                notificationPerm === 'granted'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {notificationPerm}
              </span>
            </div>

            {notificationPerm !== 'granted' ? (
              <button
                onClick={handleRequestNotification}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20 transition-all"
              >
                Enable Desktop Notifications
              </button>
            ) : (
              <button
                onClick={() => {
                  sendBrowserNotification('🔔 Test Notification', {
                    body: 'FocusFlow alerts are active and working perfectly!'
                  });
                  showToast('Test notification sent!', 'success');
                }}
                className="w-full py-2 rounded-xl text-xs font-semibold border border-purple-500/30 text-purple-300 hover:bg-purple-500/15 transition-all"
              >
                Send Test Notification
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Appearance & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            theme === 'dark'
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold tracking-tight">Theme & Appearance</h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Dark Theme</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                theme === 'light'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                  : 'border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Light Theme</span>
            </button>
          </div>
        </div>

        {/* Goals */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            theme === 'dark'
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold tracking-tight">Daily Targets</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Target Sessions
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.dailyGoalSessions || 4}
                onChange={(e) => handleSettingChange('dailyGoalSessions', Math.max(1, Number(e.target.value)))}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-bold font-mono ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Target Minutes
              </label>
              <input
                type="number"
                min="15"
                max="600"
                step="15"
                value={settings.dailyGoalMinutes || 100}
                onChange={(e) => handleSettingChange('dailyGoalMinutes', Math.max(15, Number(e.target.value)))}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-bold font-mono ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Data Management, Demo Data & Clean Slate */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/60 border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold tracking-tight">Data Management & Sample Data Controls</h3>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Backup your data, re-seed November sample sessions for testing, or wipe all sample data clean whenever you want:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Reload Sample Data */}
          <button
            onClick={loadDemoData}
            className="p-3.5 rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            title="Populate November sessions, tasks, and streaks to test all features"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Reload Sample Data</span>
          </button>

          {/* Clear Sample Data (Clean Slate) */}
          <button
            onClick={handleClearSampleConfirm}
            className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            title="Wipe sample data to start with an empty clean slate"
          >
            <Trash2 className="w-5 h-5 text-rose-400" />
            <span>Clear Sample Data</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportData}
            className={`p-3.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${
              theme === 'dark' ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Download className="w-5 h-5 text-purple-400" />
            <span>Export Backup (JSON)</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-3.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${
              theme === 'dark' ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Upload className="w-5 h-5 text-indigo-400" />
            <span>Import Data (JSON)</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
