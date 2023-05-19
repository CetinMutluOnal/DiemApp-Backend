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

  async getPostAllComments(postId: Types.ObjectId): Promise<IComment[]> {
    const comments = await this.commentModel.find({
      postId: postId,
    });

    if (!comments || comments.length == 0) {
      throw new NotFoundException('Comments Not Found');
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
