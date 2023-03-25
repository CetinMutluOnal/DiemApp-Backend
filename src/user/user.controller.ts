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
} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user-dto/create-user.dto';
import { UserService } from './user.service';
import { FormDataRequest } from 'nestjs-form-data/dist/decorators';
import { UpdateUserDto } from 'src/dto/user-dto/update-user.dto';
import { AuthUserDto } from 'src/dto/user-dto/auth-user-dto';

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

  @Post('/login')
  @FormDataRequest()
  async signIn(@Res() response, @Body() authUserDto: AuthUserDto) {
    try {
      const signedUser = await this.userService.signIn(authUserDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'signed in successfully',
      });
    } catch (error) {
      response.status(HttpStatus.FORBIDDEN).json({
        message: 'Incorrect Credentials',
      });
    }
  }

  @Put(':/id')
  async updateUser(
    @Res() response,
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const existingUser = await this.userService.updateUser(
        userId,
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

  @Get('/:id')
  async getUserByID(@Res() response, @Param('id') UserId: string) {
    try {
      const existingUser = await this.userService.getUserById(UserId);
      return response.status(HttpStatus.OK).json({
        message: 'User found successfully',
        existingUser,
      });
    } catch (error) {
      response.status(error.status).json(error.status);
    }
  }

  @Delete('/:id')
  async deleteUser(@Res() response, @Param('id') userId: string) {
    try {
      const deletedUser = await this.userService.deleteUser(userId);
      return response.status(HttpStatus.OK).json({
        message: 'User deleted successsfuly',
        deletedUser,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
}
