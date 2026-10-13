import React from 'react';
import {
  TrendingUp,
  Award,
  Layers,
  Activity,
  CheckCircle,
  Briefcase,
} from 'lucide-react';

export const AnalyticsView = ({ analytics = null }) => {
  if (!analytics) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        Loading hiring metrics and pipeline analytics...
      </div>
    );
  }

  const {
    overview = {},
    stageFunnel = [],
    topSkills = [],
    departmentStats = [],
    recentActivities = [],
  } = analytics;

  const maxStageCount = Math.max(...stageFunnel.map((s) => s.count), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>
          Hiring Pipeline & Talent Analytics
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Real-time metrics, conversion funnel, and talent intelligence calculated via MongoDB aggregation pipelines.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Stage Funnel Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <TrendingUp size={20} color="#6366f1" />
            <h3 style={{ fontSize: '1.1rem' }}>Candidate Funnel Conversion</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {stageFunnel.map((stage) => {
              const pct = Math.round((stage.count / maxStageCount) * 100);
              return (
                <div key={stage.stage} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{stage.stage}</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>
                      {stage.count} candidates
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: '999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background:
                          stage.stage === 'Hired'
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : stage.stage === 'Offer Extended'
                            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                            : stage.stage === 'Rejected'
                            ? '#ef4444'
                            : 'linear-gradient(90deg, #6366f1, #818cf8)',
                        borderRadius: '999px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Skills in Talent Pool */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Award size={20} color="#06b6d4" />
            <h3 style={{ fontSize: '1.1rem' }}>Top Skills in Talent Pool</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topSkills.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      width: '20px',
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <span style={{ fontWeight: 600, color: '#fff', textTransform: 'capitalize' }}>
                    {item.skill}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    color: '#22d3ee',
                  }}
                >
                  {item.count} candidates
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Volume */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Briefcase size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem' }}>Department Breakdown</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {departmentStats.map((dept) => (
              <div
                key={dept.department}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{dept.department}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {dept.openJobs} active open positions
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#a5b4fc' }}>
                    {dept.candidates}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>applicants</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Activity Timeline Audit */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Activity size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem' }}>Recent Pipeline Activity</h3>
          </div>

          <div className="timeline-stream">
            {recentActivities.map((act, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-title">
                    {act.candidateName} — {act.action}
                  </div>
                  <div className="timeline-details">{act.details}</div>
                  <div className="timeline-time">
                    {new Date(act.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
