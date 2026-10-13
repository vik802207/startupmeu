import React, { useState } from 'react';
import { X, Plus, UserPlus } from 'lucide-react';
import { STAGES } from './PipelineBoard';

export const NewCandidateModal = ({ jobs = [], onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: 'Bangalore, India',
    jobId: jobs[0]?._id || '',
    stage: 'Applied',
    yearsOfExperience: 0,
    currentCompany: '',
    education: '',
    skills: '',
    githubUrl: '',
    portfolioUrl: '',
    expectedSalary: '',
    noticePeriod: 'Immediate',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.jobId) {
      setError('Please fill in candidate name, email, and target role.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onSubmit({
        ...formData,
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        yearsOfExperience: Number(formData.yearsOfExperience) || 0,
      });
    } catch (err) {
      setError(err.message || 'Failed to create candidate');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
              }}
            >
              <UserPlus size={18} />
            </div>
            <div>
              <h2>Add New Candidate</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Create a candidate profile and add them to the recruitment pipeline.
              </p>
            </div>
          </div>

          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                }}
              >
                {error}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Rahul Sharma"
                  className="form-input"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="rahul@example.com"
                  className="form-input"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Job Position *</label>
                <select
                  name="jobId"
                  className="form-select"
                  required
                  value={formData.jobId}
                  onChange={handleChange}
                >
                  <option value="">Select a job requisition...</option>
                  {jobs.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.title} ({job.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Initial Pipeline Stage</label>
                <select
                  name="stage"
                  className="form-select"
                  value={formData.stage}
                  onChange={handleChange}
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Bangalore, India"
                  className="form-input"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  step="0.5"
                  min="0"
                  placeholder="0"
                  className="form-input"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Current Company / Role</label>
                <input
                  type="text"
                  name="currentCompany"
                  placeholder="e.g. Promark (Intern)"
                  className="form-input"
                  value={formData.currentCompany}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group form-full">
                <label>Education</label>
                <input
                  type="text"
                  name="education"
                  placeholder="e.g. B.Tech Computer Science, IIIT Nagpur"
                  className="form-input"
                  value={formData.education}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group form-full">
                <label>Skills (Comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="React.js, Node.js, Express.js, MongoDB, REST APIs"
                  className="form-input"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  type="url"
                  name="githubUrl"
                  placeholder="https://github.com/username"
                  className="form-input"
                  value={formData.githubUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Portfolio / LinkedIn URL</label>
                <input
                  type="url"
                  name="portfolioUrl"
                  placeholder="https://portfolio.dev"
                  className="form-input"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Expected Salary</label>
                <input
                  type="text"
                  name="expectedSalary"
                  placeholder="e.g. ₹35,000 / month"
                  className="form-input"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Notice Period</label>
                <select
                  name="noticePeriod"
                  className="form-select"
                  value={formData.noticePeriod}
                  onChange={handleChange}
                >
                  <option value="Immediate">Immediate</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Candidate Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
