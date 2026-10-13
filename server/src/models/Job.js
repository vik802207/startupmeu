import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: ['Engineering', 'Product', 'Design', 'Marketing', 'Operations', 'Sales'],
      default: 'Engineering',
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote / Bangalore',
    },
    type: {
      type: String,
      enum: ['Full-time', 'Internship', 'Contract', 'Part-time'],
      default: 'Internship',
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Draft'],
      default: 'Open',
    },
    description: {
      type: String,
      default: '',
    },
    requirements: {
      type: [String],
      default: [],
    },
    salaryRange: {
      type: String,
      default: '₹25,000 - ₹40,000 / month',
    },
    openPositions: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for candidates count applied to this job
jobSchema.virtual('candidatesCount', {
  ref: 'Candidate',
  localField: '_id',
  foreignField: 'jobId',
  count: true,
});

export const Job = mongoose.model('Job', jobSchema);
