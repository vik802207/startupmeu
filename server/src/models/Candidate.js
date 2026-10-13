import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      default: 'Interviewer',
    },
    text: {
      type: String,
      required: [true, 'Note text cannot be empty'],
      trim: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const scorecardSchema = new mongoose.Schema(
  {
    technicalSkills: { type: Number, min: 0, max: 5, default: 0 },
    problemSolving: { type: Number, min: 0, max: 5, default: 0 },
    communication: { type: Number, min: 0, max: 5, default: 0 },
    cultureFit: { type: Number, min: 0, max: 5, default: 0 },
  },
  { _id: false }
);

const candidateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Candidate full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: 'India',
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Associated job position is required'],
      index: true,
    },
    stage: {
      type: String,
      enum: [
        'Applied',
        'Screening',
        'Technical Round',
        'Culture Fit',
        'Offer Extended',
        'Hired',
        'Rejected',
      ],
      default: 'Applied',
      index: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0,
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: '',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    currentCompany: {
      type: String,
      trim: true,
      default: '',
    },
    education: {
      type: String,
      trim: true,
      default: '',
    },
    expectedSalary: {
      type: String,
      default: '',
    },
    noticePeriod: {
      type: String,
      default: 'Immediate',
    },
    scorecard: {
      type: scorecardSchema,
      default: () => ({}),
    },
    notes: {
      type: [noteSchema],
      default: [],
    },
    activities: {
      type: [activitySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for fast search across name, email, skills, education
candidateSchema.index({
  fullName: 'text',
  email: 'text',
  education: 'text',
  skills: 'text',
});

export const Candidate = mongoose.model('Candidate', candidateSchema);
