import { handler } from '../../../lib/handler';
import { authGuard } from '../../../lib/guards';
import CommentService from '../../../services/Comment.service';

const api = handler();

api.post(authGuard, async (req, res) => {
  const result = await CommentService.create(req.user, req.query, req.body);
  res.send(result);
});

api.get(async (req, res) => {
  const result = await CommentService.getList(req.query);
  res.send(result);
});

export default api;
