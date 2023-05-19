import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpStatus,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AccessTokenGuard } from 'src/common/guards';
import { LikeDto } from 'src/dto';
import { Types } from 'mongoose';

@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async likePost(@Request() req, @Res() response, @Body() likeDto: LikeDto) {
    try {
      const like = await this.likeService.createLike({
        ...likeDto,
        userId: new Types.ObjectId(req.user.userId),
      });
      return response.status(HttpStatus.CREATED).json({
        message: 'Liked Successfully',
        like,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Could not like.',
        error: error.message,
      });
    }
  }

  @Get('/:id')
  async getLikedPosts(@Res() response, @Param('id') userId: string) {
    try {
      const likes = await this.likeService.getAllLikes(
        new Types.ObjectId(userId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'Likes found Successfully',
        likes,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async deleteLike(
    @Request() req,
    @Res() response,
    @Param('id') postId: string,
  ) {
    try {
      const deletedLike = await this.likeService.deleteLike(
        new Types.ObjectId(req.user.userId),
        new Types.ObjectId(postId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'Like deleted successfully',
        deletedLike,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
}
