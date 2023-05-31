import { handler } from '../../../lib/handler';
import { authMiddleware } from '../../../lib/guards';
import ConfigService from '../../../services/Config.service';

const api = handler();

api.get(authMiddleware, async (req, res) => {
  const result = await ConfigService.getList(req.query, req.user);
  res.send(result);
});

export default api;
