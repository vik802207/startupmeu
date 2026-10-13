import { Candidate } from '../models/Candidate.js';
import { Job } from '../models/Job.js';

// GET /api/analytics
export const getAnalytics = async (req, res, next) => {
  try {
    const [
      totalCandidates,
      totalJobs,
      activeJobs,
      stageBreakdown,
      ratingStats,
      topSkills,
      departmentStats,
    ] = await Promise.all([
      Candidate.countDocuments(),
      Job.countDocuments(),
      Job.countDocuments({ status: 'Open' }),

      // Stage Funnel aggregation
      Candidate.aggregate([
        {
          $group: {
            _id: '$stage',
            count: { $sum: 1 },
          },
        },
      ]),

      // Rating and Experience stats
      Candidate.aggregate([
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
            avgExperience: { $avg: '$yearsOfExperience' },
          },
        },
      ]),

      // Top Skills aggregation
      Candidate.aggregate([
        { $unwind: '$skills' },
        {
          $group: {
            _id: { $toLower: { $trim: { input: '$skills' } } },
            count: { $sum: 1 },
          },
        },
        { $match: { _id: { $ne: '' } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),

      // Department breakdown aggregation via Jobs
      Job.aggregate([
        {
          $lookup: {
            from: 'candidates',
            localField: '_id',
            foreignField: 'jobId',
            as: 'candidates',
          },
        },
        {
          $group: {
            _id: '$department',
            openJobs: {
              $sum: { $cond: [{ $eq: ['$status', 'Open'] }, 1, 0] },
            },
            totalCandidates: { $sum: { $size: '$candidates' } },
          },
        },
        { $sort: { totalCandidates: -1 } },
      ]),
    ]);

    // Format stage counts map
    const stages = [
      'Applied',
      'Screening',
      'Technical Round',
      'Culture Fit',
      'Offer Extended',
      'Hired',
      'Rejected',
    ];

    const stageMap = {};
    stages.forEach((s) => (stageMap[s] = 0));
    stageBreakdown.forEach((item) => {
      if (item._id) stageMap[item._id] = item.count;
    });

    const activeInPipeline =
      totalCandidates - (stageMap['Hired'] || 0) - (stageMap['Rejected'] || 0);

    // Get recent candidate activities
    const recentCandidates = await Candidate.find({}, 'fullName stage activities updatedAt')
      .sort({ updatedAt: -1 })
      .limit(6)
      .lean();

    const recentActivities = [];
    recentCandidates.forEach((c) => {
      if (c.activities && c.activities.length > 0) {
        recentActivities.push({
          candidateId: c._id,
          candidateName: c.fullName,
          action: c.activities[0].action,
          details: c.activities[0].details,
          timestamp: c.activities[0].timestamp || c.updatedAt,
        });
      }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalCandidates,
          activeInPipeline: Math.max(0, activeInPipeline),
          hiredCount: stageMap['Hired'] || 0,
          totalJobs,
          activeJobs,
          avgRating: ratingStats[0]?.avgRating ? Number(ratingStats[0].avgRating.toFixed(1)) : 0,
          avgExperience: ratingStats[0]?.avgExperience
            ? Number(ratingStats[0].avgExperience.toFixed(1))
            : 0,
        },
        stageFunnel: stages.map((stage) => ({
          stage,
          count: stageMap[stage] || 0,
        })),
        topSkills: topSkills.map((s) => ({
          skill: s._id,
          count: s.count,
        })),
        departmentStats: departmentStats.map((d) => ({
          department: d._id || 'General',
          openJobs: d.openJobs,
          candidates: d.totalCandidates,
        })),
        recentActivities: recentActivities.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};
