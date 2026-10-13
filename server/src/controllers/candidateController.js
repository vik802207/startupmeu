import mongoose from 'mongoose';
import { Candidate } from '../models/Candidate.js';
import { Job } from '../models/Job.js';

// GET /api/candidates
export const getCandidates = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      stage,
      jobId,
      search,
      skill,
      minRating,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    if (stage) {
      query.stage = stage;
    }

    if (jobId && mongoose.isValidObjectId(jobId)) {
      query.jobId = jobId;
    }

    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { currentCompany: searchRegex },
        { education: searchRegex },
        { skills: searchRegex },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [total, candidates] = await Promise.all([
      Candidate.countDocuments(query),
      Candidate.find(query)
        .populate('jobId', 'title department location type')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    res.json({
      success: true,
      data: candidates,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/candidates/:id
export const getCandidateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Candidate ID' });
    }

    const candidate = await Candidate.findById(id).populate('jobId');
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    res.json({ success: true, data: candidate });
  } catch (error) {
    next(error);
  }
};

// POST /api/candidates
export const createCandidate = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      location,
      jobId,
      stage = 'Applied',
      skills = [],
      rating = 0,
      yearsOfExperience = 0,
      portfolioUrl,
      githubUrl,
      resumeUrl,
      currentCompany,
      education,
      expectedSalary,
      noticePeriod,
    } = req.body;

    if (!fullName || !email || !jobId) {
      return res.status(400).json({
        success: false,
        message: 'fullName, email, and jobId are required fields',
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({ success: false, message: 'Selected Job does not exist' });
    }

    const initialActivity = {
      action: 'Candidate Created',
      details: `Application submitted for position: ${job.title}`,
      timestamp: new Date(),
    };

    const newCandidate = await Candidate.create({
      fullName,
      email,
      phone,
      location,
      jobId,
      stage,
      skills: Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim()),
      rating: Number(rating) || 0,
      yearsOfExperience: Number(yearsOfExperience) || 0,
      portfolioUrl,
      githubUrl,
      resumeUrl,
      currentCompany,
      education,
      expectedSalary,
      noticePeriod,
      activities: [initialActivity],
    });

    const populated = await Candidate.findById(newCandidate._id).populate('jobId');

    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/candidates/:id
export const updateCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Candidate ID' });
    }

    const existing = await Candidate.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const updateData = { ...req.body };

    // Format skills if sent as string
    if (typeof updateData.skills === 'string') {
      updateData.skills = updateData.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    // Check if stage changed
    if (updateData.stage && updateData.stage !== existing.stage) {
      existing.activities.unshift({
        action: 'Stage Changed',
        details: `Moved from "${existing.stage}" to "${updateData.stage}"`,
        timestamp: new Date(),
      });
      updateData.activities = existing.activities;
    }

    const updated = await Candidate.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('jobId');

    res.json({
      success: true,
      message: 'Candidate updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/candidates/:id/stage
export const updateCandidateStage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    const validStages = [
      'Applied',
      'Screening',
      'Technical Round',
      'Culture Fit',
      'Offer Extended',
      'Hired',
      'Rejected',
    ];

    if (!validStages.includes(stage)) {
      return res.status(400).json({
        success: false,
        message: `Invalid stage. Must be one of: ${validStages.join(', ')}`,
      });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const prevStage = candidate.stage;
    candidate.stage = stage;
    candidate.activities.unshift({
      action: 'Stage Transition',
      details: `Pipeline updated: ${prevStage} ➔ ${stage}`,
      timestamp: new Date(),
    });

    await candidate.save();
    const populated = await Candidate.findById(id).populate('jobId');

    res.json({
      success: true,
      message: `Candidate stage updated to ${stage}`,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/candidates/:id/notes
export const addCandidateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { author = 'Interviewer', text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Note text is required' });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    candidate.notes.unshift({ author: author.trim(), text: text.trim(), createdAt: new Date() });
    candidate.activities.unshift({
      action: 'Note Added',
      details: `New interview feedback added by ${author.trim()}`,
      timestamp: new Date(),
    });

    await candidate.save();
    const populated = await Candidate.findById(id).populate('jobId');

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/candidates/:id/scorecard
export const updateCandidateScorecard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { technicalSkills, problemSolving, communication, cultureFit } = req.body;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const scorecard = {
      technicalSkills: Number(technicalSkills) || candidate.scorecard?.technicalSkills || 0,
      problemSolving: Number(problemSolving) || candidate.scorecard?.problemSolving || 0,
      communication: Number(communication) || candidate.scorecard?.communication || 0,
      cultureFit: Number(cultureFit) || candidate.scorecard?.cultureFit || 0,
    };

    candidate.scorecard = scorecard;

    // Recalculate average rating
    const scores = Object.values(scorecard).filter((v) => v > 0);
    if (scores.length > 0) {
      const avg = scores.reduce((sum, val) => sum + val, 0) / scores.length;
      candidate.rating = Math.round(avg * 10) / 10;
    }

    candidate.activities.unshift({
      action: 'Scorecard Evaluated',
      details: `Updated interview scorecard (Avg: ${candidate.rating}/5.0)`,
      timestamp: new Date(),
    });

    await candidate.save();
    const populated = await Candidate.findById(id).populate('jobId');

    res.json({
      success: true,
      message: 'Scorecard updated and rating calculated',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/candidates/:id
export const deleteCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Candidate ID' });
    }

    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    res.json({
      success: true,
      message: `Candidate ${candidate.fullName} removed successfully`,
    });
  } catch (error) {
    next(error);
  }
};
