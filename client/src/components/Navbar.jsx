import React from 'react';
import {
  Layers,
  Users,
  Briefcase,
  BarChart3,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  onOpenNewCandidate,
  onOpenNewJob,
  onResetSeed,
  isResetting,
}) => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon-wrapper">
          <Layers size={22} />
        </div>
        <div className="brand-text">
          <h1>TalentFlow</h1>
          <span>StartupMeu ATS</span>
        </div>
      </div>

      <nav className="nav-links">
        <button
          className={`nav-btn ${activeTab === 'pipeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('pipeline')}
        >
          <Layers size={16} />
          Pipeline
        </button>

        <button
          className={`nav-btn ${activeTab === 'candidates' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidates')}
        >
          <Users size={16} />
          Candidates
        </button>

        <button
          className={`nav-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={16} />
          Job Roles
        </button>

        <button
          className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={16} />
          Analytics
        </button>
      </nav>

      <div className="nav-actions">
        <button
          className="btn-secondary"
          onClick={onResetSeed}
          disabled={isResetting}
          title="Reload fresh demo dataset for recruiter evaluation"
        >
          <RotateCcw size={15} className={isResetting ? 'animate-spin' : ''} />
          {isResetting ? 'Resetting...' : 'Demo Data'}
        </button>

        <button className="btn-secondary" onClick={onOpenNewJob}>
          <Plus size={15} />
          Post Job
        </button>

        <button className="btn-primary" onClick={onOpenNewCandidate}>
          <Plus size={16} />
          New Candidate
        </button>
      </div>
    </header>
  );
};
