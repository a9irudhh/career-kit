import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId: string;
  personalInfo: {
    name: string;
    phone: string;
    email: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
  }>;
  links: Array<{
    platform: string;
    url: string;
  }>;
  skills: string;
  extraCurricular?: string;
  generatedContent: {
    summary: string;
    sections: Array<{
      title: string;
      content: any;
    }>;
  };
  createdBy: string; // username
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  personalInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    year: { type: String, required: true }
  }],
  experience: [{
    company: { type: String, required: true },
    position: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true }
  }],
  projects: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    technologies: { type: String, required: true }
  }],
  links: [{
    platform: { type: String, required: true },
    url: { type: String, required: true }
  }],
  skills: {
    type: String,
    required: true
  },
  extraCurricular: {
    type: String,
    default: ""
  },
  generatedContent: {
    summary: { type: String, required: true },
    sections: [{
      title: { type: String, required: true },
      content: { type: Schema.Types.Mixed, required: true }
    }]
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
ResumeSchema.index({ userId: 1, createdAt: -1 });
ResumeSchema.index({ 'personalInfo.name': 1 });

const ResumeModel = mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);

export default ResumeModel;