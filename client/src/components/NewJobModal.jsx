import React, { useState } from 'react';
import { X, Briefcase, Plus } from 'lucide-react';

export const NewJobModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote / Bangalore',
    salaryRange: '₹30,000 - ₹45,000 / month',
    openPositions: 1,
    description: '',
    requirements: '',
    status: 'Open',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a job title.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onSubmit({
        ...formData,
        requirements: formData.requirements
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean),
        openPositions: Number(formData.openPositions) || 1,
      });
    } catch (err) {
      setError(err.message || 'Failed to create job posting');
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
                background: 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
              }}
            >
              <Briefcase size={18} />
            </div>
            <div>
              <h2>Create Job Opening</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Publish a new role to begin receiving applicants.
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
              <div className="form-group form-full">
                <label>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Software Engineer Intern – MERN Stack"
                  className="form-input"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  className="form-select"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              <div className="form-group">
                <label>Employment Type</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Remote / Bangalore"
                  className="form-input"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Compensation / Salary</label>
                <input
                  type="text"
                  name="salaryRange"
                  placeholder="e.g. ₹30,000 - ₹45,000 / month"
                  className="form-input"
                  value={formData.salaryRange}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Open Positions</label>
                <input
                  type="number"
                  name="openPositions"
                  min="1"
                  className="form-input"
                  value={formData.openPositions}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="form-group form-full">
                <label>Job Description</label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Describe the mission, key responsibilities, and team..."
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group form-full">
                <label>Requirements (Comma-separated)</label>
                <input
                  type="text"
                  name="requirements"
                  placeholder="React.js, Node.js, Express.js, MongoDB, Git, Code0 workflow"
                  className="form-input"
                  value={formData.requirements}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Job Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
