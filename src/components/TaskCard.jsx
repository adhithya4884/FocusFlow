// src/components/TaskCard.jsx
import React from 'react';
import {
  Check,
  Calendar,
  Play,
  Edit2,
  Trash2,
  Target,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TaskCard({ task, onEdit }) {
  const {
    toggleTaskCompleted,
    deleteTask,
    selectTaskForTimer,
    activeTaskId,
    theme
  } = useApp();

  const isCurrentActive = activeTaskId === task.id;

  const priorityStyles = {
    High: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
  };

  const categoryStyles = {
    Coding: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    Study: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    Work: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    Design: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
    General: 'bg-slate-700/20 text-slate-400 border-slate-700/30'
  };

  const progressPercent = Math.min(
    100,
    Math.round(((task.completedPomodoros || 0) / Math.max(1, task.estimatedPomodoros || 1)) * 100)
  );

  return (
    <div
      className={`group p-4 rounded-2xl border transition-all duration-200 ${
        isCurrentActive
          ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-md shadow-purple-500/10'
          : theme === 'dark'
          ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
      } ${task.completed ? 'opacity-65' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox button */}
        <button
          onClick={() => toggleTaskCompleted(task.id)}
          className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
            task.completed
              ? 'bg-purple-600 border-purple-600 text-white'
              : theme === 'dark'
              ? 'border-slate-700 hover:border-purple-500'
              : 'border-slate-300 hover:border-purple-500'
          }`}
          title={task.completed ? 'Mark incomplete' : 'Mark completed'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-sm font-semibold truncate ${
                task.completed ? 'line-through text-slate-500' : ''
              }`}
            >
              {task.title}
            </h4>

            {/* Priority Tag */}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                priorityStyles[task.priority] || priorityStyles.Medium
              }`}
            >
              {task.priority}
            </span>

            {/* Category Tag */}
            {task.category && (
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                  categoryStyles[task.category] || categoryStyles.General
                }`}
              >
                {task.category}
              </span>
            )}

            {isCurrentActive && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500 text-white flex items-center gap-1 animate-pulse">
                <Sparkles className="w-2.5 h-2.5" /> Focusing
              </span>
            )}
          </div>

          {task.description && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Progress bar & metadata */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              {/* Pomodoro count */}
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span>🍅</span>
                <span className="font-semibold text-slate-200">
                  {task.completedPomodoros || 0}/{task.estimatedPomodoros || 1}
                </span>
              </div>

              {/* Due Date if set */}
              {task.dueDate && (
                <div className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{task.dueDate}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
              {/* One-click Focus on this task button */}
              {!task.completed && (
                <button
                  onClick={() => selectTaskForTimer(task.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isCurrentActive
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30'
                  }`}
                  title="Focus on this task in Timer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isCurrentActive ? 'Current' : 'Focus'}</span>
                </button>
              )}

              {/* Edit button */}
              <button
                onClick={() => onEdit(task)}
                className="p-1 rounded-lg hover:bg-slate-700/40 text-slate-400 hover:text-slate-200"
                title="Edit task"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              {/* Delete button */}
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pomodoro Progress Bar */}
          <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                task.completed ? 'bg-emerald-500' : 'bg-purple-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
