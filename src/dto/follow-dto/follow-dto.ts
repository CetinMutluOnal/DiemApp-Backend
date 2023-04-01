import { IsNotEmpty, IsString } from 'class-validator';
export class FollowDto {
  @IsNotEmpty()
  @IsString()
  followerId: string;

  @IsNotEmpty()
  @IsString()
  followingId: string;
}
