import { NextApiRequest, NextApiResponse } from 'next';
import pusher from '../../../lib/pusher';

const chatHistory: { messages: any[] } = { messages: [] };

function randstr(prefix: string) {
  return Math.random()
    .toString(36)
    .replace('0.', prefix || '');
}

export default function message(req: NextApiRequest, res: NextApiResponse) {
  const { body, author } = JSON.parse(req.body);
  const newMessage = { id: randstr('id_'), body, author, postedAt: new Date().toDateString() };
  chatHistory.messages.push(newMessage);
  pusher.trigger('chat', 'new-message', newMessage);
  return res.status(200);
}
