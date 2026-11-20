// src/components/TaskFormModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLocalDateString } from '../utils/dateUtils';

export default function TaskFormModal({ isOpen, onClose, taskToEdit = null }) {
  const { addTask, updateTask, theme } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('General');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(2);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  // Prefill when editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority || 'Medium');
      setCategory(taskToEdit.category || 'General');
      setEstimatedPomodoros(taskToEdit.estimatedPomodoros || 2);
      setDueDate(taskToEdit.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setCategory('General');
      setEstimatedPomodoros(2);
      setDueDate(getLocalDateString());
    }
    setError('');
  }, [taskToEdit, isOpen]);

  // Handle escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        estimatedPomodoros: Number(estimatedPomodoros),
        dueDate
      });
    } else {
      addTask({
        title,
        description,
        priority,
        category,
        estimatedPomodoros: Number(estimatedPomodoros),
        dueDate
      });
    }

    onClose();
  };

  const categories = ['General', 'Coding', 'Study', 'Work', 'Design'];
  const priorities = ['Low', 'Medium', 'High'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit">
          <h3 className="text-base font-bold">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Finish React Component Architecture"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark'
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, links, or sub-points..."
              rows={2}
              className={`w-full px-3.5 py-2 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                theme === 'dark'
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Priority & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <div className="flex rounded-xl p-1 border border-inherit bg-slate-800/30 gap-1">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      priority === p
                        ? p === 'High'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : p === 'Medium'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-emerald-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pomodoro Estimate & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Estimated Pomodoros */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Estimated Pomodoros (25m each)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEstimatedPomodoros((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-2 rounded-xl border border-inherit bg-slate-800/40 text-slate-300 font-bold hover:bg-slate-700/60"
                >
                  -
                </button>
                <div className="flex-1 text-center font-mono font-bold text-sm">
                  🍅 {estimatedPomodoros} ({estimatedPomodoros * 25}m)
                </div>
                <button
                  type="button"
                  onClick={() => setEstimatedPomodoros((prev) => Math.min(20, prev + 1))}
                  className="px-3 py-2 rounded-xl border border-inherit bg-slate-800/40 text-slate-300 font-bold hover:bg-slate-700/60"
                >
                  +
                </button>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-inherit">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all"
            >
              {taskToEdit ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
