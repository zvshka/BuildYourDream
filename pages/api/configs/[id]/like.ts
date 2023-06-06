import { handler } from '../../../../lib/handler';
import { authGuard } from '../../../../lib/guards';
import ConfigService from '../../../../services/Config.service';

const api = handler();

api.get(authGuard(true), async (req, res) => {
  const result = await ConfigService.like(req.user, req.query.id as string);
  res.send(result);
});

export default api;
