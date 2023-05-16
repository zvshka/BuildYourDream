import { prisma } from '../lib/prisma';
import { ApiError } from '../lib/ApiError';
import { User } from '../types/User';
import TemplateService from './Template.service';
import { IComponentBody, ITemplate } from '../types/Template';
import ComponentService from './Component.service';

class UpdateService {
  async approve(user: User, id: string) {
    const candidate = await prisma.updateRequest.findUnique({
      where: {
        id,
      },
    });

    if (!candidate) {
      throw ApiError.BadRequest(`Обновления с таким id (${id}) не существует`);
    }

    if (candidate.approved || candidate.rejected) {
      throw ApiError.BadRequest('Этот обновление нельзя изменить');
    }

    await prisma.updateRequest.update({
      where: {
        id,
      },
      data: {
        adminId: user.id,
        approved: true,
      },
    });

    if (candidate.templateId) {
      return TemplateService.updateTemplateById(user, {
        id: candidate.templateId,
        data: candidate.data as unknown as ITemplate,
      });
    }
    return ComponentService.updateComponentById(user, candidate.componentId as string, {
      templateId: '',
      data: candidate.data as unknown as IComponentBody,
    });
  }

  async reject(user: User, id: string, reason: string) {
    const candidate = await prisma.updateRequest.findUnique({
      where: {
        id,
      },
    });

    if (!candidate) {
      throw ApiError.BadRequest(`Обновления с таким id (${id}) не существует`);
    }

    if (candidate.approved || candidate.rejected) {
      throw ApiError.BadRequest('Этот обновление нельзя изменить');
    }

    return prisma.updateRequest.update({
      where: {
        id,
      },
      data: {
        adminId: user.id,
        rejected: true,
        rejectReason: reason,
      },
    });
  }

  async getList(filter: { [p: string]: string | string[] | undefined }) {
    const totalCount = await prisma.updateRequest.count({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        approved: false,
        rejected: false,
      },
    });

    let currentPage = 1;
    if (filter.page) {
      if (!Number.isNaN(filter.page)) {
        currentPage = parseInt(filter.page as string, 10);
        if (currentPage <= 0) currentPage = 1;
      }
    }

    const result = await prisma.updateRequest.findMany({
      skip: (currentPage - 1) * 10,
      take: 10,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        approved: false,
        rejected: false,
      },
      include: {
        componentToUpdate: {
          include: {
            template: true,
          },
        },
        templateToUpdate: true,
      },
    });

    return { result, currentPage, totalCount };
  }
}

export default new UpdateService();
