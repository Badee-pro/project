import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

// Define UserDocument interface extending Document
export interface UserDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  loginAttempts: number;
  resetToken?: string;
  resetTokenExpire?: number;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define User schema
@Schema()
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  loginAttempts: number;
  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;

  @Prop()
  resetToken?: string;

  @Prop()
  resetTokenExpire?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hash password before saving
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method on user instance
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
