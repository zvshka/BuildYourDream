import { handler } from '../../../../lib/handler';
import { authGuard } from '../../../../lib/guards';
import CommentService from '../../../../services/Comment.service';

const api = handler();

api.get(authGuard(true), async (req, res) => {
  const result = await CommentService.undelete(req.user, req.query.commentId as string);
  res.send(result);
});

export default api;
