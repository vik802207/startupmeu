import mongoose from 'mongoose';
import { Job } from '../models/Job.js';
import { Candidate } from '../models/Candidate.js';

// GET /api/jobs
export const getJobs = async (req, res, next) => {
  try {
    const { status, department } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (department) filter.department = department;

    // Use aggregation to include accurate candidate counts per job
    const jobs = await Job.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'candidates',
          localField: '_id',
          foreignField: 'jobId',
          as: 'candidateList',
        },
      },
      {
        $addFields: {
          candidatesCount: { $size: '$candidateList' },
          activeCandidatesCount: {
            $size: {
              $filter: {
                input: '$candidateList',
                as: 'c',
                cond: { $not: { $in: ['$$c.stage', ['Rejected', 'Hired']] } },
              },
            },
          },
        },
      },
      { $project: { candidateList: 0 } },
      { $sort: { createdAt: -1 } },
    ]);

    res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/jobs/:id
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Job ID' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const candidates = await Candidate.find({ jobId: id }).select('fullName email stage rating');

    res.json({
      success: true,
      data: {
        ...job.toObject(),
        candidates,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/jobs
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      department,
      location,
      type,
      status = 'Open',
      description,
      requirements = [],
      salaryRange,
      openPositions = 1,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Job title is required' });
    }

    const newJob = await Job.create({
      title,
      department,
      location,
      type,
      status,
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements.split(',').map((r) => r.trim()),
      salaryRange,
      openPositions: Number(openPositions) || 1,
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: newJob,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/jobs/:id
export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Job ID' });
    }

    const updateData = { ...req.body };
    if (typeof updateData.requirements === 'string') {
      updateData.requirements = updateData.requirements
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);
    }

    const updated = await Job.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/jobs/:id
export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Job ID' });
    }

    const candidatesCount = await Candidate.countDocuments({ jobId: id });
    if (candidatesCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete job: ${candidatesCount} candidates are currently associated with it. Move or delete them first.`,
      });
    }

    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({
      success: true,
      message: `Job "${deleted.title}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
