import { handler } from '../../../../lib/handler';
import ReviewService from '../../../../services/Review.service';
import { authGuard } from '../../../../lib/guards';

const api = handler();

api.get(async (req, res) => {
  const { componentId, ...query } = req.query;
  const result = await ReviewService.getReviewsByComponent(componentId as string, query);
  res.send(result);
});

api.post(authGuard(), async (req, res) => {
  const { componentId } = req.query;
  const result = await ReviewService.create(req.user, componentId as string, req.body);
  res.send(result);
});

export default api;
