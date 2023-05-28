import { handler } from '../../../../lib/handler';
import { authGuard } from '../../../../lib/guards';
import ConfigService from '../../../../services/Config.service';

const api = handler();

api.get(authGuard, async (req, res) => {
  const result = await ConfigService.unlike(req.user, req.query.id as string);
  res.send(result);
});

export default api;