import { NextApiRequest, NextApiResponse } from 'next';
import pusher from '../../../lib/pusher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.send({ key: process.env.PUSHER_KEY });
}
