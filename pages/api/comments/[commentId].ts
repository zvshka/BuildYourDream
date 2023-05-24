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

export default api;
