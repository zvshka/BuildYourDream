import { handler } from '../../../lib/handler';
import { authGuard, roleGuard } from '../../../lib/guards';
import UpdateService from '../../../services/Update.service';

const api = handler();

api.post(authGuard, roleGuard('ADMIN'), async (req, res) => {
  const result = await UpdateService.approve(req.user, req.body.updateId);
  res.send(result);
});

export default api;
