import { pusher } from '../../../lib/pusher';
import { handler } from '../../../lib/handler';
import ChatService from '../../../services/Chat.service';

const api = handler();

api.post(async (req, res) => {
  const { body, author } = req.body;
  const newMessage = await ChatService.createMessage({ body, author });
  console.log(newMessage);
  pusher.trigger('chat', 'new-messages', newMessage);
  res.status(200).json({ message: 'success' });
});

api.get(async (req, res) => {
  const messages = await ChatService.fetchMessages();
  res.status(200).send({ messages });
});

export default api;
