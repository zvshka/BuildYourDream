import { isDate } from 'is-what';
import dayjs from 'dayjs';
import { User } from '../types/User';
import { prisma } from '../lib/prisma';
import { ApiError } from '../lib/ApiError';
import ConfigService from './Config.service';
import CommentService from './Comment.service';

class ReportService {
  async create(
    author: User,
    reportBody: {
      commentId?: string;
      configId?: string;
      userId?: string;
      reason: string;
    }
  ) {
    let commentCandidate;
    if (reportBody.commentId && reportBody.commentId.length > 0) {
      commentCandidate = await prisma.comment.findUnique({
        where: {
          id: reportBody.commentId,
        },
      });
    }

    let configCandidate;
    if (reportBody.configId && reportBody.configId.length > 0) {
      configCandidate = await prisma.config.findUnique({
        where: {
          id: reportBody.configId,
        },
      });
    }

    let userCandidate;
    if (reportBody.userId && reportBody.userId.length > 0) {
      userCandidate = await prisma.user.findUnique({
        where: {
          id: reportBody.userId,
        },
      });
    }

    if ([commentCandidate, configCandidate].filter((c) => !!c).length > 1) {
      throw ApiError.BadRequest('Так делать нельзя');
    }

    const lastAuthorReport = await prisma.report.findFirst({
      where: {
        authorId: author.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (lastAuthorReport) {
      const diff = dayjs().diff(lastAuthorReport.createdAt, 'minutes');
      if (diff < 5) throw ApiError.BadRequest('Подожди 5 минут перед отправкой еще одной жалобы');
    }

    if (reportBody.reason.trim().length < 10) {
      throw ApiError.BadRequest('Опишите вашу жалобу (минимум 10 символов)');
    }

    return prisma.report.create({
      data: {
        authorId: author.id,
        reason: reportBody.reason,

        configId: reportBody.configId,
        configTitle: configCandidate ? configCandidate.title : null,
        configDescription: configCandidate ? configCandidate.description : null,

        commentId: reportBody.commentId,
        commentBody: commentCandidate ? commentCandidate.body : null,

        userId: configCandidate?.authorId || commentCandidate?.authorId || userCandidate.id,
        userBio: userCandidate ? userCandidate.bio : null,
        userAvatarUrl: userCandidate ? userCandidate.avatarUrl : null,
      },
    });
  }

  async approve(
    user: User,
    reportId: string,
    approveBody: { warns: number; expiredAt: Date; deleteSubject: boolean }
  ) {
    const candidate = await prisma.report.findUnique({
      where: {
        id: reportId,
      },
      include: {
        config: true,
        comment: true,
        user: true,
      },
    });
    if (!candidate || candidate.approved || candidate.rejected) {
      throw ApiError.BadRequest('Нельзя так сделать');
    }

    const result = await prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        warns: approveBody.warns,
        expiredAt: approveBody.expiredAt,

        approved: true,
        approvedAt: new Date(),
      },
    });

    const userWarns = await prisma.report.findMany({
      where: {
        userId: candidate.userId,
        expiredAt: {
          gt: new Date(),
        },
        warns: {
          gt: 0,
          not: null,
        },
        approved: true,
      },
      select: {
        warns: true,
        expiredAt: true,
      },
    });

    const totalWarns = userWarns.reduce((prev, next) => prev + next.warns!, 0);
    if (totalWarns >= 20 && !candidate.user.isBanned) {
      await prisma.user.update({
        where: {
          id: candidate.userId,
        },
        data: {
          isBanned: true,
        },
      });
    }

    if (candidate.configId && candidate.config && approveBody.deleteSubject) {
      await ConfigService.deleteById(user, candidate.configId);
    }

    if (candidate.commentId && candidate.comment && approveBody.deleteSubject) {
      await CommentService.delete(user, candidate.commentId);
    }

    return result;
  }

  async reject(reportId: string) {
    const candidate = await prisma.report.findUnique({
      where: {
        id: reportId,
      },
    });
    if (!candidate || candidate.approved || candidate.rejected) {
      throw ApiError.BadRequest('Нельзя так сделать');
    }

    return prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        rejected: true,
        rejectedAt: new Date(),
      },
    });
  }

  async delete(reportId: string, user: User) {
    const candidate = await prisma.report.findUnique({
      where: {
        id: reportId,
      },
    });
    if (!candidate || candidate.approved || candidate.rejected) {
      throw ApiError.BadRequest('Нельзя так сделать');
    }

    if (candidate.authorId !== user.id) throw ApiError.Forbidden();

    return prisma.report.delete({
      where: {
        id: reportId,
      },
    });
  }

  async getList(filter: Partial<{ [p: string]: string | string[] }>) {
    let currentPage = 1;
    if (filter.page) {
      if (!Number.isNaN(filter.page)) {
        currentPage = parseInt(filter.page as string, 10);
        if (currentPage <= 0) currentPage = 1;
      }
    }

    let statusFilter = {};
    if (filter.status !== 'all') {
      if (filter.status === 'approved') {
        statusFilter = Object.assign(statusFilter, { approved: true, rejected: false });
      } else if (filter.status === 'rejected') {
        statusFilter = Object.assign(statusFilter, { approved: false, rejected: true });
      } else if (filter.status === 'waiting') {
        statusFilter = Object.assign(statusFilter, { approved: false, rejected: false });
      }
    }

    let createdAtFilter = {};
    if (filter.createdAt) {
      const params = new URLSearchParams(filter.createdAt as string);
      const gt = params.get('gt');
      const lt = params.get('lt');
      if (gt && lt && isDate(new Date(gt)) && isDate(new Date(lt))) {
        createdAtFilter = Object.assign(createdAtFilter, {
          createdAt: {
            gte: gt,
            lte: lt,
          },
        });
      }
    }

    let reviewAtFilter = {};
    if (filter.reviewAt) {
      const params = new URLSearchParams(filter.reviewAt as string);
      const gt = params.get('gt');
      const lt = params.get('lt');
      if (gt && lt && isDate(new Date(gt)) && isDate(new Date(lt))) {
        reviewAtFilter = Object.assign(reviewAtFilter, {
          OR: [
            {
              approvedAt: {
                gte: gt,
                lte: lt,
              },
            },
            {
              rejectedAt: {
                gte: gt,
                lte: lt,
              },
            },
          ],
        });
      }
    }

    let searchFilter = {};
    if (filter.search && filter.search.length > 0) {
      searchFilter = Object.assign(searchFilter, {
        OR: [
          {
            author: {
              username: {
                contains: filter.search,
                mode: 'insensitive',
              },
            },
          },
          {
            configTitle: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            configDescription: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            commentBody: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            userBio: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            reason: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    const totalCount = await prisma.report.count({
      where: {
        ...statusFilter,
        ...createdAtFilter,
        ...reviewAtFilter,
        ...searchFilter,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const result = await prisma.report.findMany({
      skip: (currentPage - 1) * 10,
      take: 10,
      where: {
        ...statusFilter,
        ...createdAtFilter,
        ...reviewAtFilter,
        ...searchFilter,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
        user: true,
        config: {
          include: {
            author: true,
          },
        },
        comment: {
          include: {
            author: true,
          },
        },
      },
    });

    return { result, totalCount, currentPage };
  }

  async getUserList(user: User, filter: any) {
    let currentPage = 1;
    if (filter.page) {
      if (!Number.isNaN(filter.page)) {
        currentPage = parseInt(filter.page as string, 10);
        if (currentPage <= 0) currentPage = 1;
      }
    }

    const totalCount = await prisma.report.count({
      where: {
        authorId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const result = await prisma.report.findMany({
      skip: (currentPage - 1) * 10,
      take: 10,
      where: {
        authorId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
        user: true,
        config: true,
        comment: true,
      },
    });

    return { result, totalCount, currentPage };
  }

  async getUserViolations(username: string, filter: any) {
    let currentPage = 1;
    if (filter.page) {
      if (!Number.isNaN(filter.page)) {
        currentPage = parseInt(filter.page as string, 10);
        if (currentPage <= 0) currentPage = 1;
      }
    }

    let createdAtFilter = {};
    if (filter.createdAt) {
      const params = new URLSearchParams(filter.createdAt as string);
      const gt = params.get('gt');
      const lt = params.get('lt');
      if (gt && lt && isDate(new Date(gt)) && isDate(new Date(lt))) {
        createdAtFilter = Object.assign(createdAtFilter, {
          createdAt: {
            gte: gt,
            lte: lt,
          },
        });
      }
    }

    let reviewAtFilter = {};
    if (filter.reviewAt) {
      const params = new URLSearchParams(filter.reviewAt as string);
      const gt = params.get('gt');
      const lt = params.get('lt');
      if (gt && lt && isDate(new Date(gt)) && isDate(new Date(lt))) {
        reviewAtFilter = Object.assign(reviewAtFilter, {
          OR: [
            {
              approvedAt: {
                gte: gt,
                lte: lt,
              },
            },
            {
              rejectedAt: {
                gte: gt,
                lte: lt,
              },
            },
          ],
        });
      }
    }

    const candidate = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!candidate) throw ApiError.BadRequest('Такого пользователя не существует');

    const userWarns = await prisma.report.findMany({
      where: {
        userId: candidate.id,
        expiredAt: {
          gt: new Date(),
        },
        warns: {
          gt: 0,
          not: null,
        },
        approved: true,
      },
      select: {
        warns: true,
        expiredAt: true,
      },
    });

    const totalWarns = userWarns.reduce((prev, next) => prev + next.warns!, 0);

    const totalCount = await prisma.report.count({
      where: {
        ...createdAtFilter,
        ...reviewAtFilter,
        approved: true,
      },
      orderBy: {
        approvedAt: 'desc',
      },
    });

    const result = await prisma.report.findMany({
      skip: (currentPage - 1) * 10,
      take: 10,
      where: {
        ...createdAtFilter,
        ...reviewAtFilter,
        approved: true,
      },
      orderBy: {
        approvedAt: 'desc',
      },
      include: {
        author: true,
        user: true,
        config: {
          include: {
            author: true,
          },
        },
        comment: {
          include: {
            author: true,
          },
        },
      },
    });

    return { totalWarns, totalCount, result, currentPage };
  }
}

export default new ReportService();
