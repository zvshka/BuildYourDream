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

    if ([commentCandidate, configCandidate, userCandidate].filter((c) => !!c).length > 1) {
      throw ApiError.BadRequest('Так делать нельзя');
    }

    return prisma.report.create({
      data: {
        authorId: author.id,
        reason: reportBody.reason,
        configId: reportBody.configId,
        commentId: reportBody.commentId,
        userId: reportBody.userId,
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
      },
    });
    if (!candidate || candidate.approved || candidate.rejected) {
      throw ApiError.BadRequest('Нельзя так сделать');
    }

    if (candidate.configId && candidate.config && approveBody.deleteSubject) {
      await ConfigService.deleteById(user, candidate.configId);
    }

    if (candidate.commentId && candidate.comment && approveBody.deleteSubject) {
      await CommentService.delete(user, candidate.commentId);
    }

    return prisma.report.update({
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

  async getList(filter: any) {
    let currentPage = 1;
    if (filter.page) {
      if (!Number.isNaN(filter.page)) {
        currentPage = parseInt(filter.page as string, 10);
        if (currentPage <= 0) currentPage = 1;
      }
    }

    const totalCount = await prisma.report.count({
      where: {},
      orderBy: {
        createdAt: 'desc',
      },
    });

    const result = await prisma.report.findMany({
      skip: (currentPage - 1) * 10,
      take: 10,
      where: {},
      include: {
        author: true,
        user: true,
        config: true,
        comment: true,
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
      include: {
        author: true,
        user: true,
        config: true,
        comment: true,
      },
    });

    return { result, totalCount, currentPage };
  }
}

export default new ReportService();
