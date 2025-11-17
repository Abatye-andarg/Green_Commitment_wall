import mongoose, { Schema, Document } from 'mongoose';

export interface IJoinRequest extends Document {
  userId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JoinRequestSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      maxlength: 500,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
JoinRequestSchema.index({ userId: 1, organizationId: 1 });
JoinRequestSchema.index({ organizationId: 1, status: 1 });
JoinRequestSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IJoinRequest>('JoinRequest', JoinRequestSchema);
