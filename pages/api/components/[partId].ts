import { handler } from '../../../lib/handler';
import ComponentService from '../../../services/Component.service';
import { authGuard, roleGuard } from '../../../lib/guards';

const api = handler();

api.get(async (req, res) => {
  const part = await ComponentService.getPartById(req.query.partId as string);
  res.send(part);
});

api.patch(authGuard, roleGuard('ADMIN'), async (req, res) => {
  const part = await ComponentService.updatePartById(req.query.partId as string, req.body);
  res.send(part);
});

export default api;
