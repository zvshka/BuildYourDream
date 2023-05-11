import { handler } from '../../../lib/handler';
import ConfigService from '../../../services/Config.service';
import { authGuard } from '../../../lib/guards';

const api = handler();

api.get(async (req, res) => {
  const data = await ConfigService.getList(req.query);

  // res.send({ totalCount: 0, currentPage: 1, result: [] });
  res.send(data);
});

api.post(authGuard, async (req, res) => {
  const data = await ConfigService.create(req.user, req.body);

  res.send(data);
});

export default api;
