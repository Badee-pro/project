import { IsEmail, IsNotEmpty } from 'class-validator';

// This DTO is used for forgot password functionality
export class ForgotPasswordDto {
  // This field is required and must be a valid email address
  @IsEmail({}, { message: 'Please provide a valid email address' })
  // This field is required and must not be empty
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
