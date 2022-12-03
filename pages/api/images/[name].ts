import fs from 'fs';
import sharp from 'sharp';
import { NextApiRequest } from 'next';
import { MIME_TYPES } from '@mantine/dropzone';
import { handler } from '../../../lib/handler';
import ImagesService from '../../../services/Images.service';

const apiRoute = handler();

apiRoute.get(async (req: NextApiRequest & { query: { width: string; quality: string } }, res) => {
  const { name } = req.query;
  const { width, quality } = req.query;
  let widthNumber = Number(width);
  let qualityNumber = Number(quality);
  if (Number.isNaN(widthNumber)) widthNumber = 0;
  if (Number.isNaN(qualityNumber) || qualityNumber > 100 || qualityNumber < 0) {
    qualityNumber = 100;
  }
  const result = await ImagesService.getImage(name);
  if (result) {
    try {
      const imageBuffer = fs.readFileSync(result.filepath);
      const sharped = await sharp(imageBuffer).resize({
        width: widthNumber > 0 ? widthNumber : null,
      });
      if (result.mimetype === MIME_TYPES.jpeg) {
        sharped.jpeg({
          quality: qualityNumber,
        });
      } else if (result.mimetype === MIME_TYPES.png) {
        sharped.png({
          quality: qualityNumber,
        });
      }
      res.setHeader('Content-Type', result.mimetype);
      res.send(sharped);
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: 'Что-то пошло не так, попробуй еще раз или измени запрос' });
    }
  } else {
    res.status(400).json({ error: 'Изображение не найдено' });
  }
});

export default apiRoute;
