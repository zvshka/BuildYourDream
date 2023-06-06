import { handler } from '../../../../lib/handler';
import ReviewService from '../../../../services/Review.service';

const api = handler();

api.get(async (req, res) => {
  const { username, ...query } = req.query;
  const result = await ReviewService.getReviewsByUsername(username as string, query);
  res.send(result);
});

export default api;
