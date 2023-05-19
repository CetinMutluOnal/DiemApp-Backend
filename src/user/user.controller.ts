import {
  Controller,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Param,
  HttpStatus,
  Res,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/dto/';
import { UserService } from './user.service';
import { FormDataRequest } from 'nestjs-form-data';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { AccessTokenGuard } from 'src/common/guards';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @FormDataRequest()
  async createUser(@Res() response, @Body() createuserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.createUser(createuserDto);
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

  @Put('/:id')
  async updateUser(
    @Res() response,
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const existingUser = await this.userService.updateUser(
        new Types.ObjectId(userId),
        updateUserDto,
      );

      return response.status(HttpStatus.OK).json({
        message: 'User has been successfully Updated',
        existingUser,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:id/avatar')
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
  async uploadAvatar(
    @Request() req,
    @Res() response,
    @Param('id') userId: string,
    @UploadedFile() file,
  ) {
    try {
      const setAvatar = await this.userService.setAvatar(
        new Types.ObjectId(req.user.userId),
        file.path,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Avatar Updated Successfully',
        setAvatar,
      });
    } catch (error) {
      return response.status(error.status).json({
        message: error.message,
        error: error.status,
      });
    }
  }

  @Get()
  async getAllUsers(@Res() response) {
    try {
      const userData = await this.userService.getAllUser();
      return response.status(HttpStatus.OK).json({
        message: 'All Users data found successfully',
        userData,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }

  @Get('/id/:id')
  async getUserByID(@Res() response, @Param('id') UserId: string) {
    try {
      const existingUser = await this.userService.getUserById(
        new Types.ObjectId(UserId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'User found successfully',
        existingUser,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
  @Get(':username')
  async getUserByUsername(
    @Res() response,
    @Param('username') username: string,
  ) {
    try {
      const existingUser = await this.userService.getUserByUsername(
        new Types.ObjectId(username),
      );
      return response.status(HttpStatus.OK).json({
        message: 'User found successfully',
        existingUser,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }

  @Delete('/:id')
  async deleteUser(@Res() response, @Param('id') userId: string) {
    try {
      const deletedUser = await this.userService.deleteUser(
        new Types.ObjectId(userId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'User deleted successsfuly',
        deletedUser,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
}
