import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from './User.service';
import { ApiError } from '../lib/ApiError';
import { tokenPayload } from '../types/tokenPayload';
import { User } from '../types/User';
import { prisma } from '../lib/prisma';

class AuthService {
  async signup({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    const candidate = await prisma.user.findFirst({
      where: {
        username,
        email,
      },
    });
    if (candidate) {
      throw ApiError.BadRequest("Пользователь с таким Email'ом или Никнеймом уже существует");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const { hashedPassword: _, ...user } = await UserService.create({
      username,
      email,
      hashedPassword,
    });

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );

    return {
      accessToken,
      user,
    };
  }

  async signin({ username, password }: { username: string; password: string }) {
    const candidate = await UserService.findOneByUsername(username);
    if (!candidate) throw ApiError.BadRequest('Неверный никнейм или пароль');
    const { hashedPassword, ...user } = candidate;
    const compared = await bcrypt.compare(password, hashedPassword);
    if (!compared) throw ApiError.BadRequest('Неверный никнейм или пароль');

    if (candidate.isBanned) throw ApiError.Forbidden();

    const accessToken = jwt.sign(
      { id: candidate.id, role: candidate.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );

    return {
      accessToken,
      user,
    };
  }

  async exchange(token: string) {
    try {
      const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as tokenPayload;
      if (!tokenData.id) return ApiError.UnauthorizedError();
      const candidate = await UserService.findOneById(tokenData.id);
      if (!candidate) return ApiError.UnauthorizedError();
      if (candidate.isBanned) return ApiError.Forbidden();
      const { hashedPassword, ...user } = candidate;
      return { user };
    } catch (e) {
      throw ApiError.UnauthorizedError();
    }
  }

  async updateProfile(user: User, data: any) {
    return prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatarUrl: data.avatarUrl ? data.avatarUrl : '',
        bio: data.bio,
      },
    });
  }
}

export default new AuthService();
