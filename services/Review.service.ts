import { User } from '../types/User';
import ComponentService from './Component.service';
import { ApiError } from '../lib/ApiError';
import { prisma } from '../lib/prisma';
import UserService from './User.service';

class ReviewService {
  async create(
    author: User,
    componentId: string,
    data: {
      text?: string;
      rating: number;
    }
  ) {
    const candidate = await ComponentService.getComponentById(componentId);
    if (!candidate || candidate.isDeleted) {
      throw ApiError.BadRequest('Такого комплектующего не существует');
    }

    if (candidate.reviews.some((r) => r.authorId === author.id)) {
      throw ApiError.BadRequest('Вы можете оставить только 1 отзыв для одного компонента');
    }

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw ApiError.BadRequest('Ретинг может быть от 1 до 5');
    }

    if (data.text && data.text.trim().length > 1200) {
      throw ApiError.BadRequest('Отзыв не может превышать 1200 символов');
    }

    return prisma?.review.create({
      data: {
        text: data.text,
        componentId: candidate.id,
        rating: data.rating,
        authorId: author.id,
      },
    });
  }

  async updateById(
    user: User,
    reviewId: string,
    data: {
      rating: number;
      text?: string;
    }
  ) {
    const candidate = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!candidate) throw ApiError.BadRequest('Такого отзыва не существует');
    if (candidate.authorId !== user.id) throw ApiError.Forbidden();

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw ApiError.BadRequest('Ретинг может быть от 1 до 5');
    }

    if (data.text && data.text.trim().length > 1200) {
      throw ApiError.BadRequest('Отзыв не может превышать 1200 символов');
    }

    return prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        rating: data.rating,
        text: data.text,
      },
    });
  }

  async deleteById(user: User, reviewId: string) {
    const candidate = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!candidate) throw ApiError.BadRequest('Такого отзыва не существует');
    if (candidate.authorId !== user.id && user.role === 'USER') throw ApiError.Forbidden();
    return prisma.review.delete({
      where: {
        id: reviewId,
      },
    });
  }

  async getReviewsByComponent(componentId: string, filter: any) {
    await ComponentService.getComponentById(componentId);
    let currentPage = 1;
    if (filter.page) {
      if (!Number.isNaN(filter.page)) {
        currentPage = parseInt(filter.page as string, 10);
        if (currentPage <= 0) currentPage = 1;
      }
    }
    let orderBy = {};
    if (filter.orderBy && filter.orderDir) {
      const field =
        filter.orderBy === 'createdAt'
          ? 'createdAt'
          : filter.orderBy === 'rating'
          ? 'rating'
          : 'createdAt';
      const direction =
        filter.orderDir === 'desc' ? 'desc' : filter.orderDir === 'asc' ? 'asc' : 'desc';
      orderBy = Object.assign(orderBy, {
        [field]: direction,
      });
    }

    const totalCount = await prisma.review.count({
      where: {
        componentId,
      },
      orderBy,
    });

    const result = await prisma.review.findMany({
      skip: (currentPage - 1) * 10,
      take: 10,
      where: {
        componentId,
      },
      include: {
        component: {
          include: {
            template: {
              select: {
                name: true,
              },
            },
          },
        },
        author: true,
      },
      orderBy,
    });

    return {
      totalCount,
      result: result.map(({ author: { hashedPassword, ...userData }, ...data }) => ({
        ...data,
        author: userData,
      })),
      currentPage,
    };
  }

  async getReviewsByUsername(username: string, filter: any) {
    await UserService.findOneByUsername(username, true);
    let currentPage = 1;
    if (filter.page) {
      if (!Number.isNaN(filter.page)) {
        currentPage = parseInt(filter.page as string, 10);
        if (currentPage <= 0) currentPage = 1;
      }
    }
    let orderBy = {};
    if (filter.orderBy && filter.orderDir) {
      const field =
        filter.orderBy === 'createdAt'
          ? 'createdAt'
          : filter.orderBy === 'rating'
          ? 'rating'
          : 'createdAt';
      const direction =
        filter.orderDir === 'desc' ? 'desc' : filter.orderDir === 'asc' ? 'asc' : 'desc';
      orderBy = Object.assign(orderBy, {
        [field]: direction,
      });
    }

    const totalCount = await prisma.review.count({
      where: {
        author: {
          username,
        },
      },
      orderBy,
    });

    const result = await prisma.review.findMany({
      skip: (currentPage - 1) * 10,
      take: 10,
      where: {
        author: {
          username,
        },
      },
      include: {
        component: {
          include: {
            template: {
              select: {
                name: true,
              },
            },
          },
        },
        author: {
          select: {
            username: true,
            id: true,
            avatarUrl: true,
          },
        },
      },
      orderBy,
    });

    return { totalCount, result, currentPage };
  }
}

export default new ReviewService();
