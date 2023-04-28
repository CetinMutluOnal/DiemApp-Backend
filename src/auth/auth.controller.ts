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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthUserDto } from 'src/dto';
import { FormDataRequest } from 'nestjs-form-data';
import { Public } from '../common/guards/auth.guard';
import { AuthService } from './auth.service';
import { AccessTokenGuard, RefreshTokenGuard } from '../common/guards/';
import { CreateUserDto } from 'src/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('signup')
  // @FormDataRequest()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './images/avatar',
        filename: (req, file, cb) => {
          const fileName: string =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${fileName}${extension}`);
        },
      }),
    }),
  )
  async signUp(
    @Res() response,
    @UploadedFile() file,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const newUser = await this.authService.signUp({
        ...createUserDto,
        avatar: file.path,
      });
      return response.status(HttpStatus.CREATED).json({
        message: 'User has been created successfully',
        newUser,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: User not created!',
        error: 'Bad Request',
      });
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @FormDataRequest()
  async signIn(@Res() response, @Body() authUserDto: AuthUserDto) {
    try {
      const signedUser = await this.authService.signIn(authUserDto);
      return response.status(HttpStatus.OK).json({
        access_token: signedUser.access_token,
        refresh_token: signedUser.refresh_token,
      });
    } catch (error) {
      response.status(HttpStatus.FORBIDDEN).json({
        message: error.message,
      });
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshToken(@Request() req, @Res() response) {
    try {
      const tokens = await this.authService.refreshTokens(
        req.user.sub,
        req.user.refreshToken,
      );
      return response.status(HttpStatus.OK).json({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
    } catch (error) {
      response.status(HttpStatus.FORBIDDEN).json({
        message: error.message,
      });
    }
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get('logout')
  async logout(@Request() req, @Res() response) {
    try {
      await this.authService.logout(req.user.userId);
      return response.status(HttpStatus.OK).json({
        message: 'User Logged Out Successfully',
      });
    } catch (error) {
      return response.status(HttpStatus.FORBIDDEN).json({
        message: error.message,
      });
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
