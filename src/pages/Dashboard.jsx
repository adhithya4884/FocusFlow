// src/pages/Dashboard.jsx
import React from 'react';
import {
  Clock,
  Target,
  Flame,
  CheckCircle2,
  Play,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTimeGreeting, formatMinutesHuman, formatDisplayDate } from '../utils/dateUtils';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import ActivityHeatmap from '../components/ActivityHeatmap';
import StreakTooltipCard from '../components/StreakTooltipCard';

export default function Dashboard({ timerControl, onOpenTaskModal }) {
  const {
    aggregateStats,
    tasks,
    setActiveTab,
    theme,
    settings
  } = useApp();

  const greeting = getTimeGreeting();
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 3);
  const goalProgress = Math.min(
    100,
    Math.round(
      (aggregateStats.todaySessions / Math.max(1, settings.dailyGoalSessions || 4)) * 100
    )
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border-purple-500/20'
            : 'bg-gradient-to-r from-purple-50 via-indigo-50 to-white border-purple-200 shadow-sm'
        }`}
      >
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Productivity Dashboard</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {greeting}, ready to make today count?
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            You've logged <span className="font-semibold text-purple-400">{formatMinutesHuman(aggregateStats.todayFocusMinutes)}</span> of deep work today across <span className="font-semibold text-purple-400">{aggregateStats.todaySessions} sessions</span>.
          </p>

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                setActiveTab('timer');
                if (!timerControl.isRunning) timerControl.startTimer();
              }}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{timerControl.isRunning ? 'View Active Timer' : 'Quick Start Focus'}</span>
            </button>

            <button
              onClick={() => onOpenTaskModal()}
              className={`px-5 py-3 rounded-xl font-semibold text-xs border transition-all ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              + Add New Task
            </button>
          </div>
        </div>

        {/* Decorative background glow circle */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Today's Focus Time"
          value={formatMinutesHuman(aggregateStats.todayFocusMinutes)}
          subtitle={`Goal: ${settings.dailyGoalMinutes || 100}m`}
          icon={Clock}
          accentColor="purple"
        />

        <StatCard
          title="Completed Pomodoros"
          value={aggregateStats.todaySessions}
          subtitle={`${goalProgress}% of daily goal`}
          icon={Target}
          accentColor="indigo"
          badgeText={`${settings.dailyGoalSessions} target`}
        />

        {/* Current Streak with Interactive Hover Card */}
        <StreakTooltipCard>
          <div className="w-full">
            <StatCard
              title="Current Streak (Hover)"
              value={`${aggregateStats.streak.current} Days`}
              subtitle={`Longest: ${aggregateStats.streak.longest} days • Hover for breakdown`}
              icon={Flame}
              accentColor="amber"
              badgeText="Active"
            />
          </div>
        </StreakTooltipCard>

        <StatCard
          title="Completed Tasks"
          value={aggregateStats.completedTasksCount}
          subtitle={`${tasks.length} total tasks created`}
          icon={CheckCircle2}
          accentColor="emerald"
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Current Month Activity Heatmap */}
        <div className="lg:col-span-2 space-y-6">
          <ActivityHeatmap />
        </div>

        {/* Right 1 Col: Priority Tasks for Today */}
        <div
          className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
            theme === 'dark'
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold tracking-tight">Today's Focus Tasks</h3>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Task list preview */}
            <div className="space-y-3">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={onOpenTaskModal} />
                ))
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 stroke-1" />
                  <p className="text-xs">All pending tasks are complete!</p>
                  <button
                    onClick={() => onOpenTaskModal()}
                    className="mt-3 text-xs font-semibold text-purple-400 hover:underline"
                  >
                    + Create a new task
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Daily Goal Mini Card */}
          <div className="mt-6 pt-4 border-t border-inherit">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-400">Daily Session Goal</span>
              <span className="font-mono font-bold text-purple-400">
                {aggregateStats.todaySessions} / {settings.dailyGoalSessions}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
