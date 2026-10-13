import React from 'react';
import { Star, Mail, MapPin, Eye, Trash2 } from 'lucide-react';
import { STAGES } from './PipelineBoard';

export const CandidateTable = ({
  candidates = [],
  onSelectCandidate,
  onUpdateStage,
  onDeleteCandidate,
}) => {
  const getStageClass = (stage) => {
    switch (stage) {
      case 'Applied': return 'stage-applied';
      case 'Screening': return 'stage-screening';
      case 'Technical Round': return 'stage-technical';
      case 'Culture Fit': return 'stage-culture';
      case 'Offer Extended': return 'stage-offer';
      case 'Hired': return 'stage-hired';
      case 'Rejected': return 'stage-rejected';
      default: return 'stage-applied';
    }
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Role Applied</th>
            <th>Experience</th>
            <th>Current Stage</th>
            <th>Rating</th>
            <th>Location</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate._id}>
              <td>
                <div style={{ fontWeight: 600, color: '#fff' }}>
                  {candidate.fullName}
                </div>
                <div
                  style={{
                    fontSize: '0.775rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Mail size={12} />
                  {candidate.email}
                </div>
              </td>

              <td>
                <span style={{ color: '#a5b4fc', fontWeight: 500 }}>
                  {candidate.jobId?.title || 'General Applicant'}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {candidate.jobId?.department || 'General'}
                </div>
              </td>

              <td>
                {candidate.yearsOfExperience} yrs
                {candidate.currentCompany && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    @ {candidate.currentCompany}
                  </div>
                )}
              </td>

              <td>
                <select
                  className={`stage-pill ${getStageClass(candidate.stage)}`}
                  value={candidate.stage}
                  onChange={(e) => onUpdateStage(candidate._id, e.target.value)}
                  style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id} style={{ background: '#111827', color: '#fff' }}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                {candidate.rating > 0 ? (
                  <span className="rating-badge">
                    <Star size={12} fill="#fbbf24" strokeWidth={0} />
                    {candidate.rating.toFixed(1)}
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Unrated</span>
                )}
              </td>

              <td>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                  }}
                >
                  <MapPin size={12} />
                  {candidate.location || 'India'}
                </span>
              </td>

              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '8px' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                    onClick={() => onSelectCandidate(candidate)}
                    title="View candidate scorecard and profile"
                  >
                    <Eye size={13} />
                    View
                  </button>
                  <button
                    className="btn-danger-outline"
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                    onClick={() => onDeleteCandidate(candidate._id, candidate.fullName)}
                    title="Delete candidate"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {candidates.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                No candidates found matching the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
