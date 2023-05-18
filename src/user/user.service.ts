import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from 'src/dto/';
import { IUser } from 'src/interface/user.interface';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}

  async createUser(createUserdto: CreateUserDto): Promise<IUser> {
    const newUser = new this.userModel(createUserdto);
    return newUser.save();
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

  async getUserByUsername(username: string): Promise<IUser> {
    const user = await this.userModel.findOne({ username: username });
    if (!user) {
      throw new NotFoundException(`User #${username} not found`);
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

  async setAvatar(userId: string, avatarUrl: string): Promise<IUser> {
    await this.userModel.findByIdAndUpdate(userId, { avatar: avatarUrl });
    const updatedUser = await this.userModel.findById(userId);

    if (updatedUser.avatar != avatarUrl) {
      throw new BadRequestException('Avatar Could not updated');
    }
    return updatedUser;
  }
}
