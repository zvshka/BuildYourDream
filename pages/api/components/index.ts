import { handler } from '../../../lib/handler';
import ComponentService from '../../../services/Component.service';
import { authGuard } from '../../../lib/guards';

const api = handler();

api.post(authGuard, async (req, res) => {
  const partData = await ComponentService.create(req.user, req.body);
  res.send(partData);
});

export default api;
