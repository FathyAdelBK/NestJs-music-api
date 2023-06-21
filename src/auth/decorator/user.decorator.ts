import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Role } from '@prisma/client';

export class DecodedUserType {
  id: number;
  email: string;
  roles: Role;
  iat: number;
  exp: number;
}

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
