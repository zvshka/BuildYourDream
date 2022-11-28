import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { ApiError } from './ApiError';

export const handler = () =>
  nc<NextApiRequest, NextApiResponse>({
    attachParams: true,
    onError: (err, req, res, next) => {
      console.log(err);
      if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Непредвиденная ошибка' });
    },
    onNoMatch: (req, res) => {
      res.status(404).end('Страница не найдена!');
    },
  });
