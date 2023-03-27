import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/user-dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/user-dto/update-user.dto';
import { IUser } from 'src/interface/user.interface';
import { NotFoundException } from '@nestjs/common';
import * as argon from 'argon2';
import { AuthUserDto } from 'src/dto/user-dto/auth-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async createUser(createUserdto: CreateUserDto): Promise<IUser> {
    const newUser = await new this.userModel(createUserdto);
    newUser.password = await argon.hash(newUser.password);
    return newUser.save();
  }

  async signIn(authUserDto: AuthUserDto) {
    const signedUser = await this.userModel
      .findOne({
        email: authUserDto.email,
      })
      .exec();
    if (!signedUser) {
      throw new ForbiddenException('Email incorrect');
    }
    const pwMatch = await argon.verify(
      signedUser.password,
      authUserDto.password,
    );

    if (!pwMatch) {
      throw new ForbiddenException('Wrong Password!');
    }
    return this.signToken(signedUser.id, signedUser.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    const existingUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      { new: true },
    );
    if (!existingUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return existingUser;
  }

  async getAllUser(): Promise<IUser[]> {
    const users = await this.userModel.find();
    if (!users || users.length == 0) {
      throw new NotFoundException('Users data not found');
    }
    return users;
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return user;
  }

  async deleteUser(userId: string): Promise<IUser> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return deletedUser;
  }
}
