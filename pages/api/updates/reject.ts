import { handler } from '../../../lib/handler';
import { authGuard, roleGuard } from '../../../lib/guards';
import UpdateService from '../../../services/Update.service';

const api = handler();

api.post(authGuard(true), roleGuard('ADMIN'), async (req, res) => {
  const result = await UpdateService.reject(req.user, req.body.updateId, req.body.reason);
  res.send(result);
});

export default api;
