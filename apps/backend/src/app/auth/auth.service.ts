import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from '../users/users.service';
import { UserDocument } from './user.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';

interface AuthResponse {
  accessToken: string;
  user: {
    fullName: string;
    email: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  private createJwtToken(user: UserDocument): AuthResponse {
    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    const { password } = signUpDto;

    if (password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long.'
      );
    }

    // Create user via UsersService
    const user = await this.usersService.createUser(signUpDto);

    return this.createJwtToken(user);
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const { email, password } = signInDto;

    // Find the user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email is not registered.');
    }

    // Optional: Check if account is locked due to multiple login attempts
    if (user.loginAttempts >= 3) {
      throw new UnauthorizedException(
        'Your account has been locked due to multiple failed login attempts.'
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await this.usersService.incrementLoginAttempts(email);
      throw new UnauthorizedException('Wrong password.');
    }

    // Reset login attempts on successful login
    await this.usersService.resetLoginAttempts(email);

    // Create JWT payload and sign token
    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);

    // Return auth response with token and user info
    return {
      accessToken,
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    };
  }

  // Handle forgot password logic
  async handleForgotPassword(email: string): Promise<{ message: string }> {
    // Check if user exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    // Generate a reset token
    const resetToken = randomBytes(32).toString('hex');

    // Set reset token and expiry in user document
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour expiry
    await this.usersService.updateUser(user._id.toString(), {
      resetToken,
      resetTokenExpire: user.resetTokenExpire,
    });

    // Send reset email
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: './forgot-password',
      context: {
        name: user.fullName,
        resetUrl: `https://badeekh07.web.app/reset-password?token=${resetToken}`,
      },
    });

    return { message: 'Password reset email sent' };
  }

  // Reset password using token in db
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(token);
    // Validate user and token
    if (!user || user.resetTokenExpire < Date.now()) {
      throw new BadRequestException('Invalid or expired token');
    }
    if (newPassword.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long.'
      );
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await this.usersService.updateUser(user._id.toString(), user);

    return { message: 'Password has been reset successfully' };
  }
}
