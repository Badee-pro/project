import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/user.schema';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Find user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  // Find user by ID
  async findById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Create new user
  async createUser(signUpDto: SignUpDto): Promise<UserDocument> {
    const { fullName, email, password } = signUpDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser = new this.userModel({
      fullName,
      email: email.toLowerCase(),
      password,
    });

    return newUser.save();
  }

  // Increment login attempts for user by email
  async incrementLoginAttempts(email: string): Promise<void> {
    await this.userModel
      .updateOne({ email: email.toLowerCase() }, { $inc: { loginAttempts: 1 } })
      .exec();
  }

  // Reset login attempts for user by email
  async resetLoginAttempts(email: string): Promise<void> {
    await this.userModel
      .updateOne({ email: email.toLowerCase() }, { $set: { loginAttempts: 0 } })
      .exec();
  }

  // Update user details
  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }
    return this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .exec();
  }

  // Update password for user
  async updatePassword(
    userId: string,
    newPassword: string
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Set new password
    user.password = newPassword;

    return await user.save();
  }

  async findByResetToken(token: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() }, // ensure it's not expired
      })
      .exec();
  }
}
