import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePostDto } from 'src/dto/post-dto/create-post.dto';
import { FollowService } from 'src/follow/follow.service';
import { IFollow } from 'src/interface/follow.interface';
import { IPost } from 'src/interface/post.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private postModel: Model<IPost>,
    @InjectModel('Follow') private followModel: Model<IFollow>,
    private followService: FollowService,
    private userService: UserService,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const newPost = new this.postModel(createPostDto);

    return newPost.save();
  }

  async getAllPosts(): Promise<IPost[]> {
    const allPost = await this.postModel.find();

    if (!allPost || allPost.length == 0) {
      throw new NotFoundException('Post Not Found');
    }
    return allPost;
  }

  async getPostsByUserId(userId: Types.ObjectId): Promise<IPost[]> {
    const allPost = await this.postModel
      .find({ userId: userId, deletedAt: null })
      .sort({ createdAt: 'desc' });
    return allPost;
  }

  async getUserFollowsPosts(followerId: Types.ObjectId): Promise<IPost[]> {
    const feed = await this.followModel.aggregate([
      {
        $match: {
          followerId: followerId,
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'followingId',
          foreignField: 'userId',
          as: 'post',
        },
      },
      {
        $unwind: '$post',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'post.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $sort: {
          'post.createdAt': -1,
        },
      },

      {
        $project: {
          __v: 0,
          'post.__v': 0,
          'user.__v': 0,
          'user.password': 0,
          'user.refreshToken': 0,
        },
      },
    ]);

    return feed;
  }
  async getPostById(postId: Types.ObjectId): Promise<IPost> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post Not Found');
    }
    return post;
  }

  async getPostDetails(postId: Types.ObjectId): Promise<object> {
    const postDetail: any = await this.postModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(`${postId}`),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'author',
        },
      },

      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'postId',
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'likes.userId',
          foreignField: '_id',
          as: 'likedBy',
        },
      },

      {
        $addFields: {
          'likes.owner': {
            $arrayElemAt: ['$likedBy', 0],
          },
        },
      },
      {
        $project: {
          __v: 0,
          likedBy: 0,
          'author.password': 0,
          'author.refreshToken': 0,
          'author.__v': 0,
          'likes.__v': 0,
          'likes.owner.password': 0,
          'likes.owner.refreshToken': 0,
          'likes.owner.__v': 0,
        },
      },
    ]);

    if (!postDetail) {
      throw new NotFoundException('Post Not Found');
    }
    return postDetail;
  }

  async deletePost(postId: Types.ObjectId): Promise<IPost> {
    await this.postModel.findByIdAndUpdate(postId, { deletedAt: new Date() });

    const deletedPost = await this.postModel.findById(postId);

    if (deletedPost.deletedAt == null) {
      throw new NotFoundException('Post could not deleted');
    }
    return deletedPost;
  }
}
