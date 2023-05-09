import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import jwt from 'jsonwebtoken';
import { ApiError } from './ApiError';
import { tokenPayload } from '../types/tokenPayload';

export const authGuard = (
  req: NextApiRequest & { token: string },
  res: NextApiResponse,
  next: NextHandler
) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) throw ApiError.UnauthorizedError();
  const [type, token] = tokenHeader.split(' ');
  if (type.toLowerCase() !== 'bearer') throw ApiError.UnauthorizedError();
  if (!token) throw ApiError.UnauthorizedError();
  const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as tokenPayload;
  if (!tokenData.id) throw ApiError.UnauthorizedError();
  req.token = token;
  next();
};

export const roleGuard = (role) => async (req, res, next) => {
  const tokenData = jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET) as tokenPayload;
  console.log(tokenData);
  if (!tokenData.id) throw ApiError.UnauthorizedError();
  if (tokenData.role !== role) throw ApiError.Forbidden();
  next();
};
