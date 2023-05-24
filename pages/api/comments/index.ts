import { handler } from '../../../lib/handler';
import { authGuard, authMiddleware } from '../../../lib/guards';
import CommentService from '../../../services/Comment.service';

const api = handler();

api.post(authGuard, async (req, res) => {
  const result = await CommentService.create(req.user, req.query, req.body);
  res.send(result);
});

api.get(authMiddleware, async (req, res) => {
  const result = await CommentService.getList(req.query, req?.user);
  res.send(result);
});

export default api;
