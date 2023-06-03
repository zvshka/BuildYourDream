import { handler } from '../../../../lib/handler';
import { authGuard } from '../../../../lib/guards';
import ConfigService from '../../../../services/Config.service';

const api = handler();

api.get(authGuard, async (req, res) => {
  const result = await ConfigService.getLikedList(req.user, req.query);
  res.send(result);
});

export default api;
