import Error from 'next/error';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from './User.service';

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
      return new Error({
        statusCode: 401,
        title: 'Пользователь с таким email или никнеймом уже существует',
      });
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
