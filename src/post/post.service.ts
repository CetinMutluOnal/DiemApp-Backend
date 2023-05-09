import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePostDto } from 'src/dto/post-dto/create-post.dto';
import { FollowService } from 'src/follow/follow.service';
import { IPost } from 'src/interface/post.interface';
import { IUser } from 'src/interface/user.interface';
import { UserService } from 'src/user/user.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private postModel: Model<IPost>,
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

  async getPostsByUserId(userId: string): Promise<IPost[]> {
    const allPost = await this.postModel
      .find({ userId: userId, deletedAt: null })
      .sort({ createdAt: 'desc' });
    return allPost;
  }

  async getUserFollowsPosts(followerId: string): Promise<IPost[]> {
    const follows = await this.followService.getAllFollows(followerId);
    if (!follows) {
      throw new NotFoundException('User has no follows');
    }
    const followPosts: IPost[] = [];
    for (const user of follows) {
      const posts = await this.getPostsByUserId(user.followingId.toString());
      posts.forEach((post) => {
        followPosts.push(post);
      });
    }
    if (!followPosts) {
      throw new NotFoundException('User Followers has not posted yet.');
    }
    return followPosts.sort().reverse();
  }
  async getPostById(postId: string): Promise<IPost> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post Not Found');
    }
    return post;
  }

  async createPostFeed(followerId: string): Promise<object> {
    const posts: IPost[] = await this.getUserFollowsPosts(followerId);
    const feed: object[] = [];

    for (const post of posts) {
      const user = await this.userService.getUserById(post.userId.toString());
      feed.push({
        author: {
          id: post.userId,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
        },
        post: {
          id: post._id,
          content: post.content,
          media: post.media,
          createdAt: post.createdAt,
          deletedAt: post.deletedAt,
        },
      });
    }
    return feed;
  }

  async deletePost(postId: string): Promise<IPost> {
    await this.postModel.findByIdAndUpdate(postId, { deletedAt: new Date() });

    const deletedPost = await this.postModel.findById(postId);

    if (deletedPost.deletedAt == null) {
      throw new NotFoundException('Post could not deleted');
    }
    return deletedPost;
  }
}
