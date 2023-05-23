import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpStatus,
  Res,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreatePostDto } from 'src/dto/';
import { PostService } from './post.service';
import { AccessTokenGuard } from 'src/common/guards/';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @UseGuards(AccessTokenGuard)
  @Post()
  // @FormDataRequest()
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: './images/post',
        filename: (req, file, cb) => {
          const fileName: string =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${fileName}${extension}`);
        },
      }),
    }),
  )
  async createPost(
    @Res() response,
    @UploadedFile() file,
    @Body() createPostDto: CreatePostDto,
    @Request() req,
  ) {
    try {
      const newPost = await this.postService.createPost({
        ...createPostDto,
        userId: new Types.ObjectId(req.user.userId),
        media: file?.path,
      });
      return response.status(HttpStatus.CREATED).json({
        message: 'Post created successfully',
        newPost,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Post not created',
        error: error.message,
      });
    }
  }
  @Get()
  async getAllPosts(@Res() response) {
    try {
      const allPosts = await this.postService.getAllPosts();
      return response.status(HttpStatus.OK).json({
        message: 'All Posts found successfully',
        data: allPosts,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
  @UseGuards(AccessTokenGuard)
  @Get('follows')
  async getUserFollowsPosts(@Request() req, @Res() response) {
    try {
      const follows = await this.postService.getUserFollowsPosts(
        new Types.ObjectId(req.user.userId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'Post found Successfully',
        follows,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Posts Not Found',
        error: error.message,
      });
    }
  }
  @Get('/:id')
  async getPostById(@Res() response, @Param('id') postId: string) {
    try {
      const post = await this.postService.getPostById(
        new Types.ObjectId(postId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'Post found successfully',
        data: post,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }

  @Get('/user/:id')
  async getPostsByUserId(@Res() response, @Param('id') userId: string) {
    try {
      const userPosts = await this.postService.getPostsByUserId(
        new Types.ObjectId(userId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'Post found successfully',
        data: userPosts,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }

  @Get('detail/:id')
  async getPostDetailById(@Res() response, @Param('id') postId: string) {
    try {
      const post = await this.postService.getPostDetails(
        new Types.ObjectId(postId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'Post found successfully',
        data: post,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }

  @Delete('/:id')
  async deletePost(@Res() response, @Param('id') postId: string) {
    try {
      const deletedPost = await this.postService.deletePost(
        new Types.ObjectId(postId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'Post deleted successfully',
        data: deletedPost,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
}
