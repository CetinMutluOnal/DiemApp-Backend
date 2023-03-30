import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { AuthUserDto } from 'src/dto/auth-dto/auth-user.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  @FormDataRequest()
  async signIn(@Res() response, @Body() authUserDto: AuthUserDto) {
    try {
      const signedUser = await this.authService.signIn(authUserDto);
      return response.status(HttpStatus.CREATED).json({
        token: signedUser.access_token,
      });
    } catch (error) {
      response.status(HttpStatus.FORBIDDEN).json({
        message: error.message,
      });
    }
  }
}
