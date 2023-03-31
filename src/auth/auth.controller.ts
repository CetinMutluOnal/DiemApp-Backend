import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  HttpStatus,
  Request,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthUserDto } from 'src/dto/auth-dto/auth-user.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { Public } from './auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @FormDataRequest()
  async signIn(@Res() response, @Body() authUserDto: AuthUserDto) {
    try {
      const signedUser = await this.authService.signIn(authUserDto);
      return response.status(HttpStatus.OK).json({
        access_token: signedUser.access_token,
      });
    } catch (error) {
      response.status(HttpStatus.FORBIDDEN).json({
        message: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
