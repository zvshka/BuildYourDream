import { prisma } from '../lib/prisma';

class ImagesService {
  async upload({ filename, mimetype }) {
    const candidate = await prisma.image.findUnique({
      where: {
        filename,
      },
    });
    if (candidate) return candidate;
    return prisma.image
      .create({
        data: {
          filename,
          mimetype,
        },
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  }

  async getImage(name) {
    return prisma.image.findUnique({
      where: {
        filename: name,
      },
    });
  }
}

export default new ImagesService();
