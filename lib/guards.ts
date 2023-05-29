import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import jwt from 'jsonwebtoken';
import { ApiError } from './ApiError';
import { tokenPayload } from '../types/tokenPayload';
import { User } from '../types/User';
import AuthService from '../services/Auth.service';

export const authGuard = async (
  req: NextApiRequest & { token: string; user: User },
  res: NextApiResponse,
  next: NextHandler
) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) throw ApiError.UnauthorizedError();
  const [type, token] = tokenHeader.split(' ');
  if (type.toLowerCase() !== 'bearer') throw ApiError.UnauthorizedError();
  if (!token) throw ApiError.UnauthorizedError();
  let tokenData;
  try {
    tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as tokenPayload;
  } catch (e) {
    throw ApiError.UnauthorizedError();
  }
  if (!tokenData.id) throw ApiError.UnauthorizedError();
  req.token = token;
  const data = await AuthService.exchange(token);
  if (!(data instanceof ApiError)) {
    req.user = <User>data.user;
  }
  await next();
};

export const authMiddleware = async (
  req: NextApiRequest & { token?: string; user?: User },
  res: NextApiResponse,
  next: NextHandler
) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) return next();
  const [type, token] = tokenHeader.split(' ');
  if (type.toLowerCase() !== 'bearer') return next();
  if (!token) return next();
  let tokenData;
  try {
    tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as tokenPayload;
  } catch (e) {
    return next();
  }
  if (!tokenData.id) return next();
  req.token = token;
  const data = await AuthService.exchange(token);
  if (!(data instanceof ApiError)) {
    req.user = <User>data.user;
  }
  return next();
};

export const roleGuard = (roles) => async (req, res, next) => {
  let tokenData;
  try {
    tokenData = jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET) as tokenPayload;
  } catch (e) {
    throw ApiError.UnauthorizedError();
  }
  if (!tokenData.id) throw ApiError.UnauthorizedError();
  if (roles instanceof Array && !roles.includes(tokenData.role)) {
    throw ApiError.Forbidden();
  } else if (!(roles instanceof Array) && tokenData.role !== roles) throw ApiError.Forbidden();
  await next();
};
