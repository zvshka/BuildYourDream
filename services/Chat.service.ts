import { prisma } from '../lib/prisma';

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

  createMessage({ body, author }: { body: string; author: any }) {
    return prisma.message.create({
      data: {
        body,
        username: author,
      },
    });
  }
}

export default new ChatService();
