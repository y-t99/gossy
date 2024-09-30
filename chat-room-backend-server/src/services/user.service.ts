import { ProviderType } from '@prisma/client';
import { prisma } from '../dbs';
import * as Crypto from 'node:crypto';
import { encode, decode } from '../helpers';
import {
  AccountPasswordIsIncorrect,
  HttpException,
  ResourceNotFound,
} from '../exceptions';
import { StatusCodes } from 'http-status-codes';
import { ErrcodeEnum } from '../enums';
import util from 'node:util';

export async function signinByEmailAndPassword(
  email: string,
  password: string,
) {
  const account = await prisma.account.findFirst({
    where: {
      provider: ProviderType.credentials,
      providerAccountId: email,
    },
  });
  if (!account) {
    throw new HttpException(
      StatusCodes.NOT_FOUND,
      ErrcodeEnum.M_NOT_FOUND,
      util.format(ResourceNotFound, 'Account'),
    );
  }
  // 2. Get user.
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: account.userId,
    },
  });
  const encryptedPassword = Crypto.createHmac('sha512', user.salt!)
    .update(password)
    .digest('hex');
  if (encryptedPassword !== user.password) {
    throw new HttpException(
      StatusCodes.UNAUTHORIZED,
      ErrcodeEnum.M_UNAUTHORIZED,
      AccountPasswordIsIncorrect,
    );
  }
  // 3. Generate session token.
  const jwt = await encode({ token: { userId: user.id } });
  // 4. Save token.
  const jwtInfo = await decode({ token: jwt });
  await prisma.session.upsert({
    where: {
      userId: user.id,
    },
    update: {
      sessionToken: jwt,
      expires: new Date(jwtInfo!.exp * 1000),
    },
    create: {
      sessionToken: jwt,
      userId: user.id,
      expires: new Date(jwtInfo!.exp * 1000),
    },
  });
  return jwt;
}
