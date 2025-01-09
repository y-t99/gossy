import { AccountType, ProviderType } from '@prisma/client';
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
import { v4 as uuidv4 } from 'uuid';
import { AuthenticationType, LoginFlow } from '../domains';

export async function signinByEmailAndPassword(
  email: string,
  password: string,
) {
  const account = await prisma.account.findFirst({
    where: {
      provider: ProviderType.CREDENTIALS,
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
  return generateSessionToken(user.id);
}

export async function signupByEmailAndPassword(
  email: string,
  password: string,
) {
  const salt = Crypto.randomBytes(16).toString('hex');
  const encryptedPassword = Crypto.createHmac('sha512', salt)
    .update(password)
    .digest('hex');
  const user = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: uuidv4(),
        email,
        password: encryptedPassword,
        salt,
        state: 1,
        emailVerified: null,
      },
    });
    await tx.account.create({
      data: {
        userId: user.id,
        type: AccountType.credentials,
        provider: ProviderType.credentials,
        providerAccountId: email,
      },
    });
    return user;
  });
  return generateSessionToken(user.id);
}

async function generateSessionToken(userId: number) {
  const jwt = await encode({ token: { userId } });
  const jwtInfo = await decode({ token: jwt });
  await prisma.session.upsert({
    where: {
      userId,
    },
    update: {
      sessionToken: jwt,
      expires: new Date(jwtInfo!.exp * 1000),
    },
    create: {
      sessionToken: jwt,
      userId,
      expires: new Date(jwtInfo!.exp * 1000),
    },
  });
  return jwt;
}

export function getSupportedLoginTypes(): LoginFlow[] {
  return [
    {
      type: AuthenticationType.PASSWORD,
      user: true,
    },
    {
      type: AuthenticationType.TOKEN,
      get_login_token: true,
    },
  ];
}

// todo
export async function getSession(sessionToken: string) {
  const jwt = sessionToken.replace('Bearer ', '');
  const jwtInfo = await decode({ token: jwt });
  const userId = jwtInfo?.userId;
  if (userId) {
    const session = await prisma.session.findUnique({
      where: {
        userId: Number(userId),
      },
    });
    if (
      session?.sessionToken === jwt &&
      session?.expires &&
      session.expires > new Date()
    ) {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
        select: {
          id: true,
          uuid: true,
          name: true,
          image: true,
          email: true,
          phoneNumber: true,
        },
      });
      return user;
    }
  }
  return null;
}
