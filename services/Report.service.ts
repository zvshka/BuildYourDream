import { User } from '../types/User';
import { prisma } from '../lib/prisma';
import { ApiError } from '../lib/ApiError';

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

  async approve(reportId: string, approveBody: { warns: number; expiredAt: Date }) {
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

    if (candidate.authorId !== user.id) throw ApiError.UnauthorizedError();

    return prisma.report.delete({
      where: {
        id: reportId,
      },
    });
  }
}

export default new ReportService();
