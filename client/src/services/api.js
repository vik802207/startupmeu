const API_BASE = '/api';

export const api = {
  // Candidate endpoints
  async getCandidates(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/candidates?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch candidates');
    return res.json();
  },

  async getCandidateById(id) {
    const res = await fetch(`${API_BASE}/candidates/${id}`);
    if (!res.ok) throw new Error('Failed to fetch candidate details');
    return res.json();
  },

  async createCandidate(data) {
    const res = await fetch(`${API_BASE}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create candidate');
    return json;
  },

  async updateCandidate(id, data) {
    const res = await fetch(`${API_BASE}/candidates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update candidate');
    return json;
  },

  async updateCandidateStage(id, stage) {
    const res = await fetch(`${API_BASE}/candidates/${id}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update stage');
    return json;
  },

  async addCandidateNote(id, noteData) {
    const res = await fetch(`${API_BASE}/candidates/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to add feedback note');
    return json;
  },

  async updateScorecard(id, scores) {
    const res = await fetch(`${API_BASE}/candidates/${id}/scorecard`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scores),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update scorecard');
    return json;
  },

  async deleteCandidate(id) {
    const res = await fetch(`${API_BASE}/candidates/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete candidate');
    return json;
  },

  // Job endpoints
  async getJobs(params = {}) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/jobs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async createJob(data) {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create job');
    return json;
  },

  async deleteJob(id) {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete job');
    return json;
  },

  // Analytics endpoint
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Demo Data Reset endpoint
  async resetDemoData() {
    const res = await fetch(`${API_BASE}/seed/reset`, {
      method: 'POST',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to reset demo data');
    return json;
  },
};
