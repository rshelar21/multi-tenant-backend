import { Request } from 'express';
import { User } from 'src/users/user.entity';

export type RequestType = Request & {
  user?: User;
};
