import { handler } from '../../../lib/handler';
import ConfigService from '../../../services/Config.service';
import { authGuard, authMiddleware } from '../../../lib/guards';

const api = handler();

api.get(authMiddleware, async (req, res) => {
  const data = await ConfigService.getList(req.query, req.user);
  res.send(data);
});

api.post(authGuard(true), async (req, res) => {
  const data = await ConfigService.create(req.user, req.body);

  res.send(data);
});

export default api;
