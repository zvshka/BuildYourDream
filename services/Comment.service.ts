import { User } from '../types/User';
import { prisma } from '../lib/prisma';
import { ApiError } from '../lib/ApiError';

class CommentService {
  async create(author: User, query: any, data: any) {
    let componentCandidate;
    if (query.componentId && query.componentId.length > 0) {
      componentCandidate = await prisma.component.findUnique({
        where: {
          id: query.componentId,
        },
      });
    }

    let configCandidate;
    if (query.configId && query.configId.length > 0) {
      configCandidate = await prisma.config.findUnique({
        where: {
          id: query.configId,
        },
      });
    }

    if (configCandidate && componentCandidate) throw ApiError.BadRequest('Нельзя так делать');

    let replyCandidate;
    if (data.replyCommentId && data.replyCommentId.length > 0) {
      replyCandidate = await prisma.comment.findUnique({
        where: {
          id: data.replyCommentId,
        },
      });

      if (!replyCandidate) {
        throw ApiError.BadRequest('Такого комментария не существует');
      }
    }

    if (query.componentId) {
      if (!componentCandidate) throw ApiError.BadRequest('Такого компонента не существует');
      if (replyCandidate.configId || replyCandidate.componentId !== query.componentId) {
        throw ApiError.BadRequest('Нельзя так делать');
      }
    }

    if (query.configId && !configCandidate) {
      if (!configCandidate) throw ApiError.BadRequest('Такой сборки не существует');
      if (replyCandidate.componentId || replyCandidate.configId !== query.configId) {
        throw ApiError.BadRequest('Нельзя так делать');
      }
    }

    return prisma.comment.create({
      data: {
        authorId: author.id,
        body: data.body,
        replyCommentId: data.replyCommentId.length > 0 ? data.replyCommentId : undefined,
        componentId: query.componentId,
        configId: query.configId,
      },
    });
  }

  async getList(query: any) {
    const result = await prisma.comment.findMany({
      where: {
        componentId: query.componentId,
        configId: query.configId,
      },
      include: {
        author: true,
      },
    });

    return result.map((c) => ({ ...c, body: c.isDeleted ? '' : c.body }));
  }

  async update(user: User, commentId: string, body: string) {
    const candidate = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!candidate) throw ApiError.BadRequest('Такого комментария не существует');
    if (candidate.isDeleted) {
      throw ApiError.BadRequest('Вы не можете изменить удаленный комментарий');
    }
    if (user.id !== candidate.authorId) throw ApiError.UnauthorizedError();
    if (body.length === 0) throw ApiError.BadRequest('Комментарий не может быть пустым');

    return prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        body,
        isEdited: true,
      },
    });
  }

  async delete(user: User, commentId: string) {
    const candidate = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!candidate) throw ApiError.BadRequest('Такого комментария не существует');
    if (candidate.isDeleted) throw ApiError.BadRequest('Нельзя такое сделать');
    if (user.id !== candidate.authorId || !['ADMIN', 'MODERATOR'].includes(user.role)) {
      throw ApiError.UnauthorizedError();
    }

    return prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        isDeleted: true,
        deletedById: user.id,
      },
    });
  }

  async undelete(user: User, commentId: string) {
    const candidate = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        deletedBy: true,
      },
    });

    if (!candidate) throw ApiError.BadRequest('Такого комментария не существует');
    if (!candidate.isDeleted) throw ApiError.BadRequest('Вы не можете этого сделать');
    if (!['ADMIN', 'MODERATOR'].includes(candidate.deletedBy!.role) && user.role !== 'USER') {
      throw ApiError.UnauthorizedError();
    }

    if (['ADMIN', 'MODERATOR'].includes(candidate.deletedBy!.role) && user.role === 'USER') {
      throw ApiError.UnauthorizedError();
    }

    return prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        deletedBy: {
          disconnect: true,
        },
        isDeleted: false,
      },
    });
  }
}

export default new CommentService();
