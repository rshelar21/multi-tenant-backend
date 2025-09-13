import { User } from 'src/users/user.entity';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
