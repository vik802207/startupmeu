import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { PipelineBoard } from './components/PipelineBoard';
import { CandidateTable } from './components/CandidateTable';
import { JobManager } from './components/JobManager';
import { AnalyticsView } from './components/AnalyticsView';
import { CandidateModal } from './components/CandidateModal';
import { NewCandidateModal } from './components/NewCandidateModal';
import { NewJobModal } from './components/NewJobModal';
import { Toast } from './components/Toast';
import { api } from './services/api';
import { Search, Filter, RotateCcw } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('');
  const [minRatingFilter, setMinRatingFilter] = useState('');

  // Modals
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showNewCandidateModal, setShowNewCandidateModal] = useState(false);
  const [showNewJobModal, setShowNewJobModal] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Data Fetch
  const loadData = async () => {
    try {
      setLoading(true);
      const [candRes, jobRes, analRes] = await Promise.all([
        api.getCandidates({ limit: 100 }),
        api.getJobs(),
        api.getAnalytics(),
      ]);

      if (candRes.success) setCandidates(candRes.data);
      if (jobRes.success) setJobs(jobRes.data);
      if (analRes.success) setAnalytics(analRes.data);
    } catch (err) {
      console.error(err);
      showToast('Error loading application data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter candidates locally for snappy responsiveness
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // Search query filter (matches name, email, skills, company, education)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.fullName?.toLowerCase().includes(q);
        const matchesEmail = c.email?.toLowerCase().includes(q);
        const matchesCompany = c.currentCompany?.toLowerCase().includes(q);
        const matchesEducation = c.education?.toLowerCase().includes(q);
        const matchesSkills = c.skills?.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesCompany && !matchesEducation && !matchesSkills) {
          return false;
        }
      }

      // Job Filter
      if (selectedJobFilter && c.jobId?._id !== selectedJobFilter && c.jobId !== selectedJobFilter) {
        return false;
      }

      // Stage Filter
      if (selectedStageFilter && c.stage !== selectedStageFilter) {
        return false;
      }

      // Min Rating Filter
      if (minRatingFilter && (c.rating || 0) < Number(minRatingFilter)) {
        return false;
      }

      return true;
    });
  }, [candidates, searchQuery, selectedJobFilter, selectedStageFilter, minRatingFilter]);

  // Stage Update Handler (Optimistic)
  const handleUpdateStage = async (candidateId, newStage) => {
    const prevCandidates = [...candidates];
    setCandidates((prev) =>
      prev.map((c) => (c._id === candidateId ? { ...c, stage: newStage } : c))
    );

    if (selectedCandidate && selectedCandidate._id === candidateId) {
      setSelectedCandidate((prev) => ({ ...prev, stage: newStage }));
    }

    try {
      const res = await api.updateCandidateStage(candidateId, newStage);
      showToast(`Updated stage to "${newStage}"`);
      // Refresh analytics
      api.getAnalytics().then((a) => a.success && setAnalytics(a.data));
    } catch (err) {
      setCandidates(prevCandidates);
      showToast('Failed to update stage: ' + err.message, 'error');
    }
  };

  // Add Feedback Note
  const handleAddNote = async (candidateId, noteData) => {
    try {
      const res = await api.addCandidateNote(candidateId, noteData);
      setCandidates((prev) =>
        prev.map((c) => (c._id === candidateId ? res.data : c))
      );
      setSelectedCandidate(res.data);
      showToast('Interview feedback logged successfully');
      api.getAnalytics().then((a) => a.success && setAnalytics(a.data));
    } catch (err) {
      showToast('Failed to add note: ' + err.message, 'error');
      throw err;
    }
  };

  // Update Scorecard
  const handleUpdateScorecard = async (candidateId, scores) => {
    try {
      const res = await api.updateScorecard(candidateId, scores);
      setCandidates((prev) =>
        prev.map((c) => (c._id === candidateId ? res.data : c))
      );
      setSelectedCandidate(res.data);
      showToast('Scorecard updated and composite rating calculated');
      api.getAnalytics().then((a) => a.success && setAnalytics(a.data));
    } catch (err) {
      showToast('Failed to update scorecard: ' + err.message, 'error');
      throw err;
    }
  };

  // Create Candidate
  const handleCreateCandidate = async (candidateData) => {
    try {
      const res = await api.createCandidate(candidateData);
      setCandidates((prev) => [res.data, ...prev]);
      setShowNewCandidateModal(false);
      showToast(`Added ${res.data.fullName} to the recruitment pipeline!`);
      // Refresh jobs to update applicant counts
      api.getJobs().then((j) => j.success && setJobs(j.data));
      api.getAnalytics().then((a) => a.success && setAnalytics(a.data));
    } catch (err) {
      throw err;
    }
  };

  // Delete Candidate
  const handleDeleteCandidate = async (candidateId, candidateName) => {
    if (!window.confirm(`Are you sure you want to remove candidate "${candidateName}"?`)) {
      return;
    }

    try {
      await api.deleteCandidate(candidateId);
      setCandidates((prev) => prev.filter((c) => c._id !== candidateId));
      if (selectedCandidate?._id === candidateId) {
        setSelectedCandidate(null);
      }
      showToast(`Removed candidate "${candidateName}"`);
      api.getJobs().then((j) => j.success && setJobs(j.data));
      api.getAnalytics().then((a) => a.success && setAnalytics(a.data));
    } catch (err) {
      showToast('Failed to delete candidate: ' + err.message, 'error');
    }
  };

  // Create Job
  const handleCreateJob = async (jobData) => {
    try {
      const res = await api.createJob(jobData);
      setJobs((prev) => [res.data, ...prev]);
      setShowNewJobModal(false);
      showToast(`Job opening "${res.data.title}" published!`);
      api.getAnalytics().then((a) => a.success && setAnalytics(a.data));
    } catch (err) {
      throw err;
    }
  };

  // Filter By Job from JobManager
  const handleFilterByJob = (jobId) => {
    setSelectedJobFilter(jobId);
    setActiveTab('pipeline');
  };

  // Reset Demo Data
  const handleResetSeed = async () => {
    if (!window.confirm('Reset all candidate and job data to initial realistic demo values?')) {
      return;
    }

    try {
      setIsResetting(true);
      await api.resetDemoData();
      showToast('Demo data reloaded successfully! Fresh candidates and jobs seeded.');
      await loadData();
    } catch (err) {
      showToast('Failed to reset demo data: ' + err.message, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewCandidate={() => setShowNewCandidateModal(true)}
        onOpenNewJob={() => setShowNewJobModal(true)}
        onResetSeed={handleResetSeed}
        isResetting={isResetting}
      />

      {/* High-level stats banner */}
      <StatsOverview overview={analytics?.overview} />

      {/* Controls Bar: Search & Filters (Shown on Pipeline and Candidates views) */}
      {(activeTab === 'pipeline' || activeTab === 'candidates') && (
        <div className="controls-bar glass-panel">
          <div className="search-box">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by candidate name, skill, education..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={selectedJobFilter}
              onChange={(e) => setSelectedJobFilter(e.target.value)}
            >
              <option value="">All Job Positions ({jobs.length})</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} ({job.candidatesCount || 0})
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={selectedStageFilter}
              onChange={(e) => setSelectedStageFilter(e.target.value)}
            >
              <option value="">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Technical Round">Technical Round</option>
              <option value="Culture Fit">Culture Fit</option>
              <option value="Offer Extended">Offer Extended</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              className="filter-select"
              value={minRatingFilter}
              onChange={(e) => setMinRatingFilter(e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="4.5">★ 4.5+ Stars</option>
              <option value="4.0">★ 4.0+ Stars</option>
              <option value="3.5">★ 3.5+ Stars</option>
            </select>

            {(searchQuery || selectedJobFilter || selectedStageFilter || minRatingFilter) && (
              <button
                className="btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedJobFilter('');
                  setSelectedStageFilter('');
                  setMinRatingFilter('');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <main>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            Loading TalentFlow workspace...
          </div>
        ) : (
          <>
            {activeTab === 'pipeline' && (
              <PipelineBoard
                candidates={filteredCandidates}
                onSelectCandidate={setSelectedCandidate}
                onUpdateStage={handleUpdateStage}
              />
            )}

            {activeTab === 'candidates' && (
              <CandidateTable
                candidates={filteredCandidates}
                onSelectCandidate={setSelectedCandidate}
                onUpdateStage={handleUpdateStage}
                onDeleteCandidate={handleDeleteCandidate}
              />
            )}

            {activeTab === 'jobs' && (
              <JobManager
                jobs={jobs}
                onOpenNewJob={() => setShowNewJobModal(true)}
                onFilterByJob={handleFilterByJob}
                onDeleteJob={() => {}}
              />
            )}

            {activeTab === 'analytics' && <AnalyticsView analytics={analytics} />}
          </>
        )}
      </main>

      {/* Candidate Profile / Scorecard Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onUpdateStage={handleUpdateStage}
          onAddNote={handleAddNote}
          onUpdateScorecard={handleUpdateScorecard}
        />
      )}

      {/* Create Candidate Modal */}
      {showNewCandidateModal && (
        <NewCandidateModal
          jobs={jobs}
          onClose={() => setShowNewCandidateModal(false)}
          onSubmit={handleCreateCandidate}
        />
      )}

      {/* Create Job Modal */}
      {showNewJobModal && (
        <NewJobModal
          onClose={() => setShowNewJobModal(false)}
          onSubmit={handleCreateJob}
        />
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
