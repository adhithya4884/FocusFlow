// src/pages/Tasks.jsx
import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import TaskCard from '../components/TaskCard';

export default function Tasks({ onOpenTaskModal }) {
  const { tasks, theme } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'High' | 'Medium' | 'Low'
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'completed'
          ? task.completed
          : !task.completed;

      // Priority
      const matchesPriority =
        priorityFilter === 'all' ? true : task.priority === priorityFilter;

      // Category
      const matchesCategory =
        categoryFilter === 'all' ? true : task.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const categories = ['all', 'General', 'Coding', 'Study', 'Work', 'Design'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & New Task Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Task Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize priorities, estimate Pomodoros, and track completion progress
          </p>
        </div>

        <button
          onClick={() => onOpenTaskModal()}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 flex items-center gap-2 self-start sm:self-auto transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/60 border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks by name or description..."
              className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800/80 border-slate-700 text-slate-200 placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center rounded-xl p-1 border border-inherit bg-slate-800/30 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'pending'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'completed'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task List Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onOpenTaskModal} />
          ))}
        </div>
      ) : (
        <div
          className={`py-16 px-6 text-center rounded-3xl border ${
            theme === 'dark'
              ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
              : 'bg-white border-slate-200 text-slate-500 shadow-sm'
          }`}
        >
          <AlertCircle className="w-10 h-10 mx-auto text-slate-500 mb-3 stroke-1" />
          <h3 className="text-sm font-bold text-slate-200 mb-1">No tasks match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search keywords, priority filter, or create a brand new task.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-400 hover:bg-purple-500/10 border border-purple-500/20"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
