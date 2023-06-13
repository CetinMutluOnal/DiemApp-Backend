import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FollowDto } from 'src/dto/follow-dto/follow-dto';
import { IFollow } from 'src/interface/follow.interface';
import { IUser } from 'src/interface/user.interface';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel('Follow') private followModel: Model<IFollow>,
    @InjectModel('User') private userModel: Model<IUser>,
  ) {}

  async createFollow(followDto: FollowDto): Promise<IFollow> {
    const follow = new this.followModel(followDto);
    return follow.save();
  }

  async getAllFollows(followerId: Types.ObjectId): Promise<IFollow[]> {
    const follows = await this.followModel.aggregate([
      {
        $match: {
          followerId: followerId,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'followingId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $project: {
          __v: 0,
          'user.__v': 0,
          'user.password': 0,
          'user.refreshToken': 0,
        },
      },
    ]);
    if (!follows || follows.length == 0) {
      throw new NotFoundException('Follows Not Found');
    }
    return follows;
  }

  async getAllFollowers(followingId: Types.ObjectId): Promise<IFollow[]> {
    const follows = await this.followModel.aggregate([
      {
        $match: {
          followingId: followingId,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'followerId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $project: {
          __v: 0,
          'user.__v': 0,
          'user.password': 0,
          'user.refreshToken': 0,
        },
      },
    ]);
    if (!follows || follows.length == 0) {
      throw new NotFoundException('Follows Not Found');
    }
    return follows;
  }

  async deleteFollow(followerId: Types.ObjectId, followingId: Types.ObjectId) {
    const follow = await this.followModel.findOneAndDelete({
      followerId: followerId,
      followingId: followingId,
    });

    if (!follow) {
      throw new NotFoundException('Follow not found');
    }
    return follow;
  }

  async deleteFollower(
    followerId: Types.ObjectId,
    followingId: Types.ObjectId,
  ) {
    const follow = await this.followModel.findOneAndDelete({
      followerId: followerId,
      followingId: followingId,
    });

    if (!follow) {
      throw new NotFoundException('Follow not found');
    }
    return follow;
  }

  async controlFollow(
    followerId: Types.ObjectId,
    followingId: Types.ObjectId,
  ): Promise<any> {
    const isFollowed = await this.followModel.find({
      followerId: followerId,
      followingId: followingId,
    });
    if (!isFollowed || isFollowed.length == 0) {
      throw new NotFoundException('Follow Not Found');
    }
    return isFollowed;
  }

  async discoverUsers(userId: Types.ObjectId) {
    try {
      const follows = await this.getAllFollows(userId);

      const followedIds = follows.map((follow) => follow.followingId);

      const recommendUsers = await this.userModel
        .aggregate([
          { $match: { _id: { $nin: followedIds, $ne: userId } } },
          {
            $project: {
              __v: 0,
              password: 0,
              refreshToken: 0,
            },
          },
          { $sample: { size: 10 } },
        ])
        .exec();

      if (!recommendUsers) {
        throw new NotFoundException('Not Found');
      }

      return recommendUsers;
    } catch (error) {
      const recommendUsers = await this.userModel
        .aggregate([
          { $match: { _id: { $ne: userId } } },
          {
            $project: {
              __v: 0,
              password: 0,
              refreshToken: 0,
            },
          },
          { $sample: { size: 10 } },
        ])
        .exec();

      return recommendUsers;
    }
  }
}
