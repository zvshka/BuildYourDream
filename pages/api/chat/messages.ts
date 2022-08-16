import { NextApiRequest, NextApiResponse } from 'next';
import { pusher } from '../../../lib/pusher';

const chatHistory: { messages: any[] } = { messages: [] };

function randstr(prefix: string) {
  return Math.random()
    .toString(36)
    .replace('0.', prefix || '');
}

export default async function messages(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { body, author } = JSON.parse(req.body);
    const newMessage = { id: randstr('id_'), body, author, postedAt: Date.now() };
    pusher.trigger('chat', 'new-messages', newMessage);
    chatHistory.messages.push(newMessage);
    res.status(200).json({ message: 'success' });
  } else if (req.method === 'GET') {
    res.status(200).json({ messages: chatHistory.messages });
  }
}
