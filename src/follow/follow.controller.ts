import {
  Controller,
  Get,
  Post,
  Delete,
  Res,
  Request,
  HttpStatus,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowDto } from 'src/dto/follow-dto/follow-dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Public } from 'src/auth/auth.guard';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async createFollow(
    @Request() req,
    @Res() response,
    @Body() followDto: FollowDto,
  ) {
    try {
      const followerId = req.user.userId;
      const createFollowDto = { ...followDto, followerId };
      const createFollow = await this.followService.createFollow(
        createFollowDto,
      );
      return response.status(HttpStatus.CREATED).json({
        message: 'Followed Successfully',
        createFollow,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Follow not created',
        error: 'Bad Request',
      });
    }
  }

  @Get('/:id')
  async getAllFollows(@Res() response, @Param('id') followerId: string) {
    try {
      const follows = await this.followService.getAllFollows(followerId);
      return response.status(HttpStatus.OK).json({
        message: 'Followings found successfully',
        follows,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
  @Get('/followers/:id')
  async getAllFollowers(@Res() response, @Param('id') followingId: string) {
    try {
      const follows = await this.followService.getAllFollowers(followingId);
      return response.status(HttpStatus.OK).json({
        message: 'Followings found successfully',
        follows,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteFollow(
    @Res() response,
    @Request() req,
    @Param('id') followingId: string,
  ) {
    try {
      const follows = await this.followService.deleteFollow(
        req.user.userId,
        followingId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Unfollowed successfully',
        follows,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }

  @Delete('/follower/:id')
  @UseGuards(JwtAuthGuard)
  async deleteFollower(
    @Res() response,
    @Request() req,
    @Param('id') followingId: string,
  ) {
    try {
      const follows = await this.followService.deleteFollower(
        followingId,
        req.user.userId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Follower removed successfully',
        follows,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
}
