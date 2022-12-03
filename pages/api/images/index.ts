import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
// import { AuthGuard } from '@lib/AuthGuard';
import sharp from 'sharp';
import { MIME_TYPES } from '@mantine/dropzone';
import fs from 'fs';
import { handler } from '../../../lib/handler';
import ImagesService from '../../../services/Images.service';
import path from 'path';

sharp.cache(false);

const outputFolderName = path.resolve('./public/uploads');

const upload = multer({
  // limits: { fileSize: oneMegabyteInBytes * 2 },
  storage: multer.diskStorage({
    destination: outputFolderName,
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
  fileFilter: (req, file, cb) => {
    const acceptFile: boolean = ['image/jpeg', 'image/png'].includes(file.mimetype);
    cb(null, acceptFile);
  },
});

const apiRoute = handler();

apiRoute.use(upload.single('upload'));

apiRoute.post(
  // AuthGuard(),
  async (req: NextApiRequest & { user: any; file: any }, res: NextApiResponse) => {
    const { filename, mimetype, path: filepath } = req.file;
    const sharped = sharp(filepath);
    if (mimetype === MIME_TYPES.jpeg) {
      sharped.jpeg({
        quality: 85,
      });
    } else if (mimetype === MIME_TYPES.png) {
      sharped.png({
        quality: 85,
      });
    }
    const buffer = await sharped.toBuffer();
    fs.writeFileSync(filepath, buffer);
    const result = await ImagesService.upload({
      filename,
      mimetype,
      size: Buffer.byteLength(buffer),
      filepath,
    });
    if (result) {
      res.status(200).json({ url: `${process.env.BASE_URL}/api/images/${filename}` });
    } else {
      res.status(500).json({ error: 'Что-то пошло не так' });
    }
  }
);

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
export default apiRoute;
