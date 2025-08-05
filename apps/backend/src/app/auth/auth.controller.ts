import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ProductsService } from '../product/products.service';

// Controller for endpoints
@Controller('api')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private readonly productsService: ProductsService
  ) {}

  // Sign-up endpoint
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      const user = await this.authService.signUp(signUpDto);
      return {
        message: 'User registered successfully',
        user: { email: user.user.email, fullName: user.user.fullName },
      };
    } catch (error) {
      this.handleSignUpErrors(error);
    }
  }

  // Sign-in endpoint
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const { accessToken, user } = await this.authService.signIn(signInDto);
      return { accessToken, user };
    } catch (error) {
      this.handleSignInErrors(error);
    }
  }

  // Protected endpoint
  @Get('protected-data')
  @UseGuards(JwtAuthGuard)
  async getProtectedData() {
    return this.productsService.findAll();
  }

  // Forgot password endpoint
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      this.logger.log(
        `Handling forgot password for ${forgotPasswordDto.email}`
      );
      const result = await this.authService.handleForgotPassword(
        forgotPasswordDto.email
      );
      return {
        message:
          'If the email exists, password reset instructions have been sent.',
        result,
      };
    } catch (error) {
      this.logger.error('Error in forgotPassword', error);
      throw new HttpException(
        'Failed to process forgot password request. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Reset password endpoint
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

  // Handle sign-up errors
  private handleSignUpErrors(error: Error) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      'Sign-up failed. Please try again.',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  // Handle sign-in errors
  private handleSignInErrors(error: Error) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      'Authentication failed. Please try again.',
      HttpStatus.UNAUTHORIZED
    );
  }

  // Get user profile endpoint
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return { user: req.user };
  }
}
