import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpStatus,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AccessTokenGuard } from 'src/common/guards';
import { CreateCommentDto } from 'src/dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/:id')
  @FormDataRequest()
  async createComment(
    @Request() req,
    @Res() response,
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    try {
      const userId = req.user.userId;
      const finalCommentDto = { ...createCommentDto, userId, postId };
      const comment = await this.commentService.createComment(finalCommentDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Comment created successfully',
        comment,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 400,
        message: 'Comment could not created',
        error: error.message,
      });
    }
  }

  @Get('/post/:id')
  async getPostAllComments(@Res() response, @Param('id') postId: string) {
    try {
      const comments = await this.commentService.getPostAllComments(postId);
      return response.status(HttpStatus.OK).json({
        message: 'Comments found successfully',
        comments,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }

  @Get('/user/:id')
  async getUserAllComments(@Res() response, @Param('id') userId: string) {
    try {
      const comments = await this.commentService.getUserAllComments(userId);
      return response.status(HttpStatus.OK).json({
        message: 'Comments found successfully',
        comments,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async deleteComment(
    @Request() req,
    @Res() response,
    @Param('id') commentId: string,
  ) {
    try {
      const deletedComment = await this.commentService.deleteComment(
        req.user.userId,
        commentId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Comment deleted successfully',
        deletedComment,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
}
