import React from 'react';
import { Users, UserCheck, TrendingUp, Star, Briefcase } from 'lucide-react';

export const StatsOverview = ({ overview = {} }) => {
  const {
    totalCandidates = 0,
    activeInPipeline = 0,
    hiredCount = 0,
    activeJobs = 0,
    avgRating = 0,
  } = overview;

  const stats = [
    {
      label: 'Total Applicants',
      value: totalCandidates,
      icon: Users,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.12)',
    },
    {
      label: 'Active in Pipeline',
      value: activeInPipeline,
      icon: TrendingUp,
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.12)',
    },
    {
      label: 'Hired Candidates',
      value: hiredCount,
      icon: UserCheck,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)',
    },
    {
      label: 'Open Positions',
      value: activeJobs,
      icon: Briefcase,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)',
    },
    {
      label: 'Average Score',
      value: `${avgRating || 0}/5.0`,
      icon: Star,
      color: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.12)',
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div key={idx} className="stat-card glass-panel">
            <div
              className="stat-icon"
              style={{ background: stat.bg, color: stat.color }}
            >
              <IconComponent size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
