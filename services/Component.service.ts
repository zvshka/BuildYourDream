import { prisma } from '../lib/prisma';

class ComponentService {
  //TODO: Add checks
  async create(data: any) {
    return prisma.component.create({
      data,
    });
  }

  async getListByTemplate(
    templateId: string,
    filter: { [p: string]: string | string[] | undefined }
  ) {
    const totalCount = await prisma.component.count({
      //TODO: Add more filters
      where: {
        templateId,
        AND: [
          {
            data: {
              path: ['Название'],
              string_contains: (filter?.search as string) || '',
            },
          },
        ],
      },
    });

    let currentPage = 1;
    if (filter.page) {
      if (!Number.isNaN(filter.page)) {
        currentPage = parseInt(filter.page as string, 10);
        if (currentPage <= 0) currentPage = 1;
      }
    }

    const result = await prisma.component.findMany({
      skip: (currentPage - 1) * 10,
      take: 10,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        templateId,
        AND: [
          {
            data: {
              path: ['Название'],
              string_contains: (filter?.search as string) || '',
            },
          },
        ],
      },
    });

    return { result, currentPage, totalCount };
  }

  getPartById(partId: string) {
    return prisma.component.findUnique({
      where: {
        id: partId,
      },
    });
  }

  updatePartById(partId: string, data: any) {
    return prisma.component.update({
      where: {
        id: partId,
      },
      data,
    });
  }
}

export default new ComponentService();
