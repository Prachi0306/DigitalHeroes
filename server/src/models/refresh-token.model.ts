import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
  token: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
}

const RefreshTokenSchema: Schema = new Schema(
  {
    token: {
      type: String,
      required: [true, 'Token string is required'],
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User association is required'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
RefreshTokenSchema.index({ token: 1 }, { unique: true });
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-expire from MongoDB

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
