import { handler } from '../../../lib/handler';
import { authGuard } from '../../../lib/guards';
import ReviewService from '../../../services/Review.service';

const api = handler();

api.delete(authGuard(), async (req, res) => {
  const result = await ReviewService.deleteById(req.user, req.query.reviewId as string);
  res.send(result);
});

api.patch(authGuard(), async (req, res) => {
  const result = await ReviewService.updateById(req.user, req.query.reviewId as string, req.body);
  res.send(result);
});

export default api;
