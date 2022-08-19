import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import UserService from './User.service';

interface tokenPayload {
  id: string;
  role: string;
}

class ChatService {
  fetchMessages({ begin, amount = 40 }: { begin?: string; amount?: number } = { amount: 40 }) {
    return prisma.message.findMany({
      take: amount,
      ...(begin
        ? {
            cursor: {
              id: begin,
            },
          }
        : {}),
      orderBy: {
        createdAt: begin ? 'asc' : 'desc',
      },
    });
  }

  async createMessage({ body, authorization }: { body: string; authorization?: string }) {
    let username = 'Анон';
    let authorId;
    if (authorization) {
      const [type, token] = authorization.split(' ');
      let tokenData;
      if (type.toLowerCase() === 'bearer') {
        try {
          tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as tokenPayload;
        } catch (e) {
          tokenData = {};
        }
        if (tokenData.id) {
          const user = await UserService.findOneById(tokenData.id);
          if (user) {
            authorId = tokenData.id;
            username = user.username;
          }
        }
      }
    }
    return prisma.message.create({
      data: {
        body,
        username,
        authorId,
      },
    });
  }
}

export default new ChatService();
