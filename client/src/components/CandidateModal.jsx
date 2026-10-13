import React, { useState } from 'react';
import {
  X,
  Star,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Code2,
  Building2,
  GraduationCap,
  Clock,
  DollarSign,
  Send,
  Save,
} from 'lucide-react';
import { STAGES } from './PipelineBoard';

export const CandidateModal = ({
  candidate,
  onClose,
  onUpdateStage,
  onAddNote,
  onUpdateScorecard,
}) => {
  if (!candidate) return null;

  const [scores, setScores] = useState({
    technicalSkills: candidate.scorecard?.technicalSkills || 0,
    problemSolving: candidate.scorecard?.problemSolving || 0,
    communication: candidate.scorecard?.communication || 0,
    cultureFit: candidate.scorecard?.cultureFit || 0,
  });

  const [noteText, setNoteText] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Hiring Manager');
  const [savingScorecard, setSavingScorecard] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  const handleScoreChange = (metric, value) => {
    setScores((prev) => ({ ...prev, [metric]: Number(value) }));
  };

  const handleSaveScorecard = async () => {
    setSavingScorecard(true);
    try {
      await onUpdateScorecard(candidate._id, scores);
    } finally {
      setSavingScorecard(false);
    }
  };

  const handleAddNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setAddingNote(true);
    try {
      await onAddNote(candidate._id, {
        author: noteAuthor.trim() || 'Interviewer',
        text: noteText.trim(),
      });
      setNoteText('');
    } finally {
      setAddingNote(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2>{candidate.fullName}</h2>
              {candidate.rating > 0 && (
                <span className="rating-badge">
                  <Star size={12} fill="#fbbf24" strokeWidth={0} />
                  {candidate.rating.toFixed(1)} / 5.0
                </span>
              )}
            </div>
            <div style={{ color: '#a5b4fc', fontSize: '0.875rem', marginTop: '2px' }}>
              Applied for: {candidate.jobId?.title || 'General Position'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <select
              className="stage-select-mini"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              value={candidate.stage}
              onChange={(e) => onUpdateStage(candidate._id, e.target.value)}
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Quick Info Grid */}
          <div className="detail-meta-grid">
            <div className="meta-item">
              <div className="meta-label">Email</div>
              <div className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={13} color="var(--text-secondary)" />
                {candidate.email}
              </div>
            </div>

            {candidate.phone && (
              <div className="meta-item">
                <div className="meta-label">Phone</div>
                <div className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={13} color="var(--text-secondary)" />
                  {candidate.phone}
                </div>
              </div>
            )}

            <div className="meta-item">
              <div className="meta-label">Location</div>
              <div className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="var(--text-secondary)" />
                {candidate.location || 'India'}
              </div>
            </div>

            <div className="meta-item">
              <div className="meta-label">Experience</div>
              <div className="meta-value">
                {candidate.yearsOfExperience} yrs
                {candidate.currentCompany ? ` (${candidate.currentCompany})` : ''}
              </div>
            </div>

            {candidate.education && (
              <div className="meta-item" style={{ gridColumn: 'span 2' }}>
                <div className="meta-label">Education</div>
                <div className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <GraduationCap size={14} color="var(--text-secondary)" />
                  {candidate.education}
                </div>
              </div>
            )}

            {candidate.noticePeriod && (
              <div className="meta-item">
                <div className="meta-label">Notice Period</div>
                <div className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} color="var(--text-secondary)" />
                  {candidate.noticePeriod}
                </div>
              </div>
            )}

            {candidate.expectedSalary && (
              <div className="meta-item">
                <div className="meta-label">Expected CTC</div>
                <div className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <DollarSign size={13} color="var(--text-secondary)" />
                  {candidate.expectedSalary}
                </div>
              </div>
            )}
          </div>

          {/* Links & Skills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            {candidate.githubUrl && (
              <a
                href={candidate.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <Code2 size={14} />
                GitHub Profile
              </a>
            )}

            {candidate.portfolioUrl && (
              <a
                href={candidate.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <ExternalLink size={14} />
                Portfolio Website
              </a>
            )}
          </div>

          {candidate.skills && candidate.skills.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Core Competencies & Skills:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {candidate.skills.map((skill, i) => (
                  <span key={i} className="skill-tag" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Evaluation Scorecard */}
          <div className="scorecard-box">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div>
                <h4 style={{ fontSize: '1rem', color: '#fff' }}>Interview Evaluation Scorecard</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Rate the candidate across key dimensions to calculate composite fit.
                </p>
              </div>

              <button
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={handleSaveScorecard}
                disabled={savingScorecard}
              >
                <Save size={13} />
                {savingScorecard ? 'Saving...' : 'Update Scores'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { key: 'technicalSkills', label: 'Technical Proficiency & Coding' },
                { key: 'problemSolving', label: 'System Design & Problem Solving' },
                { key: 'communication', label: 'Communication & Articulation' },
                { key: 'cultureFit', label: 'Startup Agility & Culture Fit' },
              ].map((metric) => (
                <div key={metric.key} className="score-row">
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {metric.label}
                  </span>
                  <div className="score-slider-wrap">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={scores[metric.key]}
                      onChange={(e) => handleScoreChange(metric.key, e.target.value)}
                    />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', width: '35px', textAlign: 'right' }}>
                      {scores[metric.key]}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes and Feedback Section */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '10px' }}>
              Interview Notes & Team Feedback ({candidate.notes?.length || 0})
            </h4>

            {candidate.notes && candidate.notes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {candidate.notes.map((note, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: '#a5b4fc' }}>{note.author}</span>
                      <span>
                        {new Date(note.createdAt).toLocaleDateString()} at{' '}
                        {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                No interviewer feedback logged yet.
              </p>
            )}

            {/* Add Note Form */}
            <form onSubmit={handleAddNoteSubmit} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Interviewer Name / Role"
                className="form-input"
                style={{ width: '180px' }}
                value={noteAuthor}
                onChange={(e) => setNoteAuthor(e.target.value)}
              />
              <input
                type="text"
                placeholder="Log interview feedback or notes..."
                className="form-input"
                style={{ flex: 1 }}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={addingNote || !noteText.trim()}
              >
                <Send size={14} />
                Add
              </button>
            </form>
          </div>

          {/* Activity Timeline Audit */}
          {candidate.activities && candidate.activities.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Audit Timeline
              </h4>
              <div className="timeline-stream" style={{ maxHeight: '150px' }}>
                {candidate.activities.map((act, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="timeline-title">{act.action}</div>
                      <div className="timeline-details">{act.details}</div>
                      <div className="timeline-time">
                        {new Date(act.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
