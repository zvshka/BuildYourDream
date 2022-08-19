import dayjs from 'dayjs';
import { pusher } from '../../../lib/pusher';
import { handler } from '../../../lib/handler';
import ChatService from '../../../services/Chat.service';

const api = handler();

api.post(async (req, res) => {
  const { body } = req.body;
  const { authorization } = req.headers;
  const newMessage = await ChatService.createMessage({ body, authorization });
  pusher.trigger('chat', 'new-messages', newMessage);
  res.status(200).json({ message: 'success' });
});

api.get(async (req, res) => {
  const messages = await ChatService.fetchMessages();
  res.status(200).send({
    messages: messages.sort((m1, m2) => dayjs(m1.createdAt).diff(m2.createdAt)),
  });
});

export default api;
