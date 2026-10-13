import React from 'react';
import { Briefcase, MapPin, Users, Plus, DollarSign, CheckCircle2 } from 'lucide-react';

export const JobManager = ({
  jobs = [],
  onOpenNewJob,
  onFilterByJob,
  onDeleteJob,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>
            Open Startup Roles ({jobs.length})
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage active requisitions and track applicant volume per position.
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenNewJob}>
          <Plus size={16} />
          Create New Job Role
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px',
        }}
      >
        {jobs.map((job) => (
          <div
            key={job._id}
            className="glass-panel"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '10px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      color: '#a5b4fc',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {job.department}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', marginTop: '2px', color: '#fff' }}>
                    {job.title}
                  </h3>
                </div>

                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background:
                      job.status === 'Open'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(239, 68, 68, 0.15)',
                    color: job.status === 'Open' ? '#34d399' : '#f87171',
                    border: `1px solid ${
                      job.status === 'Open'
                        ? 'rgba(16, 185, 129, 0.3)'
                        : 'rgba(239, 68, 68, 0.3)'
                    }`,
                  }}
                >
                  {job.status}
                </span>
              </div>

              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '16px',
                  lineHeight: '1.5',
                }}
              >
                {job.description || 'No description provided.'}
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '16px',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} />
                  {job.location}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Briefcase size={13} />
                  {job.type}
                </span>
                {job.salaryRange && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={13} />
                    {job.salaryRange}
                  </span>
                )}
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                    }}
                  >
                    Key Requirements:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {job.requirements.map((req, i) => (
                      <span key={i} className="skill-tag">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#6366f1" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
                  {job.candidatesCount || 0} applicants
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ({job.activeCandidatesCount || 0} active)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  onClick={() => onFilterByJob(job._id)}
                >
                  View in Board
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
