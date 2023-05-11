import { handler } from '../../../lib/handler';
import ComponentService from '../../../services/Component.service';
import { authGuard, roleGuard } from '../../../lib/guards';

const api = handler();

api.post(authGuard, roleGuard('ADMIN'), async (req, res) => {
  const partData = await ComponentService.create(req.body);
  res.send(partData);
});

export default api;
