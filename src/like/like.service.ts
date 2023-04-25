import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeDto } from 'src/dto';
import { ILike } from 'src/interface/like.interface';

@Injectable()
export class LikeService {
  constructor(@InjectModel('Like') private likeModel: Model<ILike>) {}

  async createLike(likeDto: LikeDto): Promise<ILike> {
    const like = new this.likeModel(likeDto);
    return like.save();
  }

  async getAllLikes(userId: string): Promise<ILike[]> {
    const likes = await this.likeModel.find({ userId: userId });

    if (!likes || likes.length == 0) {
      throw new NotFoundException('Likes Not Found');
    }
    return likes;
  }

  async deleteLike(userId: string, postId: string): Promise<ILike> {
    const deletedLike = await this.likeModel.findOneAndDelete({
      userId: userId,
      postId: postId,
    });

    if (!deletedLike) {
      throw new NotFoundException('Like Not Found');
    }
    return deletedLike;
  }
}
