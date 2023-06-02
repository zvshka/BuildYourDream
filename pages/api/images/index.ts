import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import { MIME_TYPES } from '@mantine/dropzone';
import fs from 'fs';
import path from 'path';
import { handler } from '../../../lib/handler';
import ImagesService from '../../../services/Images.service';
import { ApiError } from '../../../lib/ApiError';

sharp.cache(false);

const outputFolderName = path.resolve('./uploads');

const upload = multer({
  // limits: { fileSize: 1048576 * 2, files: 1 },
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

apiRoute.post(async (req: NextApiRequest & { user: any; file: any }, res: NextApiResponse) => {
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
  });
  if (result) {
    res.json({ url: `${process.env.BASE_URL}/api/images/${filename}` });
  } else {
    throw ApiError.BadRequest('Что-то пошло не так');
  }
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
export default apiRoute;
