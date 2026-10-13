import React from 'react';
import { Star, Building2, GraduationCap, ChevronRight } from 'lucide-react';

export const STAGES = [
  { id: 'Applied', name: 'Applied', color: '#94a3b8' },
  { id: 'Screening', name: 'Screening', color: '#06b6d4' },
  { id: 'Technical Round', name: 'Technical Round', color: '#6366f1' },
  { id: 'Culture Fit', name: 'Culture Fit', color: '#a855f7' },
  { id: 'Offer Extended', name: 'Offer Extended', color: '#f59e0b' },
  { id: 'Hired', name: 'Hired', color: '#10b981' },
  { id: 'Rejected', name: 'Rejected', color: '#ef4444' },
];

export const PipelineBoard = ({
  candidates = [],
  onSelectCandidate,
  onUpdateStage,
}) => {
  return (
    <div className="kanban-board">
      {STAGES.map((stage) => {
        const stageCandidates = candidates.filter((c) => c.stage === stage.id);

        return (
          <div key={stage.id} className="kanban-column">
            <div className="kanban-column-header">
              <div className="column-title-wrap">
                <span
                  className="column-dot"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="column-title">{stage.name}</span>
              </div>
              <span className="column-count">{stageCandidates.length}</span>
            </div>

            <div className="kanban-cards-list">
              {stageCandidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="candidate-card"
                  onClick={() => onSelectCandidate(candidate)}
                >
                  <div className="card-header">
                    <h4 className="candidate-name">{candidate.fullName}</h4>
                    {candidate.rating > 0 && (
                      <span className="rating-badge">
                        <Star size={11} fill="#fbbf24" strokeWidth={0} />
                        {candidate.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="card-job-title">
                    {candidate.jobId?.title || 'General Applicant'}
                  </div>

                  <div className="card-meta">
                    {candidate.currentCompany ? (
                      <span
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Building2 size={12} />
                        {candidate.currentCompany}
                      </span>
                    ) : candidate.education ? (
                      <span
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <GraduationCap size={12} />
                        {candidate.education.split(',')[0]}
                      </span>
                    ) : (
                      <span>{candidate.yearsOfExperience} yrs exp</span>
                    )}
                  </div>

                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="card-skills-row">
                      {candidate.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="skill-tag">+{candidate.skills.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="card-footer" onClick={(e) => e.stopPropagation()}>
                    <span>Move stage:</span>
                    <select
                      className="stage-select-mini"
                      value={candidate.stage}
                      onChange={(e) => onUpdateStage(candidate._id, e.target.value)}
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {stageCandidates.length === 0 && (
                <div
                  style={{
                    padding: '24px 12px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: '8px',
                    margin: '8px 0',
                  }}
                >
                  No candidates in this stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
