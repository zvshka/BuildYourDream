import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cuid from 'cuid';
import nodemailer from 'nodemailer';
import dayjs from 'dayjs';
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

    const userData = await UserService.create({
      username,
      email,
      hashedPassword,
    });

    await this.sendVerify(userData);

    const accessToken = jwt.sign(
      { id: userData.id, role: userData.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );

    const { hashedPassword: _, ...user } = userData;

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
    if (data.bio && data.bio.trim().length > 1200) {
      throw ApiError.BadRequest('Слишком много символов (максимум 1200)');
    }

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

  async sendVerify(user: User) {
    if (user.emailVerification?.doneAt) throw ApiError.BadRequest('Вы не можете этого сделать');
    const code = await prisma.emailVerification.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        code: cuid(),
        expiredAt: dayjs().add(2, 'h').toISOString(),
      },
      update: {
        code: cuid(),
        expiredAt: dayjs().add(2, 'h').toISOString(),
      },
    });

    // Send mail
    let account;
    if (process.env.NODE_ENV === 'development') {
      account = await nodemailer.createTestAccount();
    } else {
      account = {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      };
    }

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host:
        process.env.NODE_ENV !== 'development' ? 'mail.buildyourdream.ru' : 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: account,
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: '"Build Your Dream" <admin@buildyourdream.ru>', // sender address
      to: user.email, // list of receivers
      subject: 'Подтверждение Email', // Subject line
      text: `Перейдите по ссылке чтобы подтвердить Email
${process.env.BASE_URL}/auth/verify?code=${code.code}`, // plain text body
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return true;
  }

  async handleVerify(code: string) {
    const candidate = await prisma.emailVerification.findUnique({
      where: {
        code,
      },
    });

    if (!candidate || dayjs(candidate.expiredAt).diff() < 0) {
      throw ApiError.BadRequest('Недействительный код');
    }

    return prisma.emailVerification.update({
      where: {
        code,
      },
      data: {
        doneAt: dayjs().toISOString(),
      },
    });
  }

  async sendReset(toFind: string) {
    const candidate = await prisma.user.findFirst({
      where: {
        OR: [{ email: toFind }, { username: toFind }],
      },
      include: {
        emailVerification: true,
      },
    });

    if (
      !candidate ||
      !candidate.emailVerification ||
      (candidate.emailVerification && !candidate.emailVerification.doneAt)
    ) {
      return false;
    }

    const code = await prisma.passwordReset.upsert({
      where: {
        userId: candidate.id,
      },
      update: {
        code: cuid(),
        expiredAt: dayjs().add(2, 'h').toISOString(),
      },
      create: {
        code: cuid(),
        userId: candidate.id,
        expiredAt: dayjs().add(2, 'h').toISOString(),
      },
    });

    // Send mail
    let account;
    if (process.env.NODE_ENV === 'development') {
      account = await nodemailer.createTestAccount();
    } else {
      account = {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      };
    }

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host:
        process.env.NODE_ENV !== 'development' ? 'mail.buildyourdream.ru' : 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: account,
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: '"Build Your Dream" <admin@buildyourdream.ru>', // sender address
      to: candidate.email, // list of receivers
      subject: 'Смена пароля', // Subject line
      text: `Перейдите по ссылке чтобы сменить пароль
${process.env.BASE_URL}/auth/reset?code=${code.code}\nЕсли вы не запрашивали смену - проигнорируйте письмо`, // plain text body
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return true;
  }

  async handleReset(code: string, data: any) {
    const candidate = await prisma.passwordReset.findUnique({
      where: {
        code,
      },
    });

    if (!candidate || dayjs(candidate.expiredAt).diff() < 0) {
      throw ApiError.BadRequest('Недействительный код');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.update({
      where: {
        id: candidate.userId,
      },
      data: {
        hashedPassword,
      },
    });

    await prisma.passwordReset.delete({
      where: {
        code,
      },
    });

    return true;
  }
}

export default new AuthService();
