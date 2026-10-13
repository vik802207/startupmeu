import { Job } from '../models/Job.js';
import { Candidate } from '../models/Candidate.js';
import { initialJobs, getCandidatesForJobs } from './seedData.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database with initial data...');

    // Clear existing collections
    await Promise.all([Job.deleteMany({}), Candidate.deleteMany({})]);

    // Insert Jobs
    const createdJobs = await Job.insertMany(initialJobs);
    console.log(`✅ Seeded ${createdJobs.length} job postings.`);

    // Build job map { title -> _id }
    const jobMap = {};
    createdJobs.forEach((job) => {
      jobMap[job.title] = job._id;
    });

    // Insert Candidates
    const candidateData = getCandidatesForJobs(jobMap);
    const createdCandidates = await Candidate.insertMany(candidateData);
    console.log(`✅ Seeded ${createdCandidates.length} candidate profiles with interview scorecards.`);

    return {
      jobsCount: createdJobs.length,
      candidatesCount: createdCandidates.length,
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  }
};

// Check if database needs seeding on startup
export const autoSeedIfEmpty = async () => {
  try {
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      console.log('⚡ Empty database detected. Auto-seeding realistic startup data...');
      await seedDatabase();
    }
  } catch (err) {
    console.error('⚠️ Auto-seed check failed:', err.message);
  }
};
