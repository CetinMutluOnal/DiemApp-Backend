import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly name: string;
  readonly userName: string;
  readonly email: string;
  readonly password: string;
  readonly avatar: string | undefined;
}
