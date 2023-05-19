import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { AuthUserDto } from 'src/dto/auth-dto/auth-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/interface/user.interface';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/dto/user-dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private jwt: JwtService,
    private userService: UserService,
    private config: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (userExists) {
      throw new BadRequestException('User Already Exists');
    }
    const hash = await argon.hash(createUserDto.password);
    const newUser = await this.userService.createUser({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.signToken(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: Types.ObjectId) {
    return this.userService.updateUser(userId, { refreshToken: null });
  }

  async signIn(authUserDto: AuthUserDto): Promise<any> {
    const user = await this.userModel.findOne({ email: authUserDto.email });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const pwMatch = await argon.verify(user.password, authUserDto.password);
    if (!pwMatch) {
      throw new UnauthorizedException('Wrong Password');
    }
    const tokens = await this.signToken(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    this.userService.updateUser(userId, { refreshToken: hashedRefreshToken });
  }

  async refreshTokens(userId: Types.ObjectId, refreshToken: string) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Not Denied');
    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.signToken(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async signToken(
    userId: Types.ObjectId,
    email: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const payload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_ACCESS_SECRET'),
      }),
      this.jwt.signAsync(payload, {
        expiresIn: '7d',
        secret: this.config.get('JWT_REFRESH_SECRET'),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
