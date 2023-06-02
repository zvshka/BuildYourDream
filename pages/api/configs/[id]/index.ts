import { handler } from '../../../../lib/handler';
import ConfigService from '../../../../services/Config.service';
import { authGuard } from '../../../../lib/guards';

const api = handler();

api.get(async (req, res) => {
  const data = await ConfigService.getConfigById(req.query.id as string);
  res.send(data);
});

api.delete(authGuard, async (req, res) => {
  const result = await ConfigService.deleteById(req.user, req.query.id as string);
  res.send(result);
});

api.patch(authGuard, async (req, res) => {
  const result = await ConfigService.updateConfigById(req.user, req.query.id as string, req.body);
  res.send(result);
});

export default api;
