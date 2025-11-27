import { UserService } from '../services/user.service';
import { BaseController } from '../base/BaseController';
import { User, Prisma } from '@prisma/client';

type UserCreateInput = Prisma.UserCreateInput;
type UserUpdateInput = Prisma.UserUpdateInput;
type UserWhereInput = Prisma.UserWhereInput;

export class UserController extends BaseController<User, UserCreateInput, UserUpdateInput, UserWhereInput> {
  modelName = 'User';

  constructor() {
    super(new UserService());
  }
}

