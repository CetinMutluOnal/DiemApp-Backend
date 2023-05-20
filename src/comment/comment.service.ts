import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCommentDto } from 'src/dto';
import { IComment } from 'src/interface/comment.interface';

@Injectable()
export class CommentService {
  constructor(@InjectModel('Comment') private commentModel: Model<IComment>) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<IComment> {
    const comment = new this.commentModel(createCommentDto);

    return comment.save();
  }

  // async getPostAllComments(postId: Types.ObjectId): Promise<IComment[]> {
  //   const comments = await this.commentModel.find({
  //     postId: postId,
  //   });

  //   if (!comments || comments.length == 0) {
  //     throw new NotFoundException('Comments Not Found');
  //   }
  //   return comments;
  // }

  async getPostAllComments(postId: Types.ObjectId): Promise<object> {
    const comments: any = await this.commentModel.aggregate([
      {
        $match: {
          postId: new Types.ObjectId(`${postId}`),
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
          localField: 'userId',
          foreignField: '_id',
          as: 'author',
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
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'postId',
          as: 'replies',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'replies.userId',
          foreignField: '_id',
          as: 'replyAuthors',
        },
      },

      {
        $addFields: {
          'replies.author': {
            $arrayElemAt: ['$replyAuthors', 0],
          },
        },
      },
      {
        $project: {
          __v: 0,
          replyAuthors: 0,
          likedBy: 0,
          'author.__v': 0,
          'author.password': 0,
          'author.refreshToken': 0,
          'likes.__v': 0,
          'likes.owner.__v': 0,
          'likes.owner.password': 0,
          'likes.owner.refreshToken': 0,
          'replies.__v': 0,
          'replies.author.__v': 0,
          'replies.author.password': 0,
          'replies.author.refreshToken': 0,
        },
      },
    ]);

    if (!comments) {
      throw new NotFoundException('Post Not Found');
    }
    return comments;
  }

  async getUserAllComments(userId: Types.ObjectId): Promise<IComment[]> {
    const comments = await this.commentModel.find({
      userId: userId,
    });

    if (!comments || comments.length == 0) {
      throw new NotFoundException('Comments Not Found');
    }
    return comments;
  }

  async deleteComment(
    userId: Types.ObjectId,
    commentId: Types.ObjectId,
  ): Promise<IComment> {
    await this.commentModel.findOneAndUpdate(
      {
        userId: userId,
        _id: commentId,
      },
      { deletedAt: new Date() },
    );

    const deletedComment = await this.commentModel.findOne({
      userId: userId,
      _id: commentId,
    });

    if (deletedComment.deletedAt == null) {
      throw new NotFoundException('Comment not deleted');
    }

    return deletedComment;
  }
}
