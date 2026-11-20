// src/components/KeyboardShortcutsModal.jsx
import React from 'react';
import { X, Command } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function KeyboardShortcutsModal() {
  const { shortcutsModalOpen, setShortcutsModalOpen, theme } = useApp();

  if (!shortcutsModalOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Start or Pause Pomodoro timer' },
    { key: 'R', desc: 'Reset current timer session' },
    { key: 'S', desc: 'Skip to next session (Break or Focus)' },
    { key: 'F', desc: 'Toggle Fullscreen Zen Focus Mode' },
    { key: 'M', desc: 'Mute / Play Ambient Soundscape' },
    { key: '?', desc: 'Toggle this keyboard shortcuts cheat-sheet' },
    { key: 'Esc', desc: 'Close dialogs or exit Zen Mode' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl relative ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <Command className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-400">Boost your workflow with quick keys</p>
            </div>
          </div>
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="divide-y divide-inherit py-3">
          {shortcuts.map((sc, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-400">{sc.desc}</span>
              <kbd
                className={`px-2.5 py-1 rounded-lg font-mono font-bold border shadow-sm ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-purple-300'
                    : 'bg-slate-100 border-slate-300 text-purple-700'
                }`}
              >
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="pt-3 text-[11px] text-slate-400 text-center">
          Note: Shortcuts are disabled when typing inside task forms or text inputs.
        </div>
      </div>
    </div>
  );
}
