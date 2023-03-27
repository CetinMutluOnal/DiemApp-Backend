import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from 'src/dto/post-dto/create-post.dto';
import { UpdatePostDto } from 'src/dto/post-dto/update-post.dto';
import { IPost } from 'src/interface/post.interface';

@Injectable()
export class PostService {
  constructor(@InjectModel('Post') private postModel: Model<IPost>) {}

  async createPost(createPostDto: CreatePostDto) {
    const newPost = await new this.postModel(createPostDto);

    return newPost.save();
  }

  async getAllPosts(): Promise<IPost[]> {
    const allPost = await this.postModel.find();

    if (!allPost || allPost.length == 0) {
      throw new NotFoundException('Post Not Found');
    }
    return allPost;
  }

  async getPostById(postId: string): Promise<IPost> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post Not Found');
    }
    return post;
  }

  async deletePost(postId: string): Promise<IPost> {
    const deletedPost = await this.postModel.findByIdAndDelete(postId).exec();

    if (!deletedPost) {
      throw new NotFoundException('Post could not deleted');
    }
    return deletedPost;
  }
}
