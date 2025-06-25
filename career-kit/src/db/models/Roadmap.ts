import mongoose, { Schema, Document } from 'mongoose';

export interface IRoadmap extends Document {
    jobTitle: string;
    level: string;
    timeRange: string;
    roadmapContent: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

const RoadmapSchema: Schema = new Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: String,
        required: true,
        enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
    },
    timeRange: {
        type: String,
        required: true
    },
    roadmapContent: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    }
}, {
    timestamps: true
});

// Create index for better query performance
RoadmapSchema.index({ userId: 1, createdAt: -1 });
RoadmapSchema.index({ userId: 1, jobTitle: 1 });

const RoadmapModel = mongoose.models.Roadmap || mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);

export default RoadmapModel;