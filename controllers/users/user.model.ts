import * as mongoose from 'mongoose';

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String, select: false }
});

export const User = mongoose.model<User>('User', UserSchema);
