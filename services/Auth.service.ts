import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from './User.service';
import { ApiError } from '../lib/ApiError';

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
    const candidate =
      (await UserService.findOneByEmail(email)) || (await UserService.findOneByUsername(username));
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
}

export default new AuthService();
