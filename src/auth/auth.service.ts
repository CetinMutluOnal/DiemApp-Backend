import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { AuthUserDto } from 'src/dto/auth-dto/auth-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/interface/user.interface';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signIn(authUserDto: AuthUserDto): Promise<any> {
    const user = await this.userModel.findOne({ email: authUserDto.email });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const pwMatch = await argon.verify(user.password, authUserDto.password);
    if (!pwMatch) {
      throw new UnauthorizedException('Wrong Password');
    }
    return this.signToken(user._id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
