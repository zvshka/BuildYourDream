import { handler } from '../../../lib/handler';
import { authGuard } from '../../../lib/guards';
import CommentService from '../../../services/Comment.service';

const api = handler();

api.patch(authGuard, async (req, res) => {
  const result = await CommentService.update(
    req.user,
    req.query.commentId as string,
    req.body.body
  );
  res.send(result);
});

api.delete(authGuard, async (req, res) => {
  const result = await CommentService.delete(req.user, req.query.commentId as string);
  res.send(result);
});

api.get('/undelete', authGuard, async (req, res) => {
  const result = await CommentService.undelete(req.user, req.query.commentId as string);
  res.send(result);
});

export default api;
