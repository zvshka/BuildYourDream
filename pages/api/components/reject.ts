import { handler } from '../../../lib/handler';
import { authGuard, roleGuard } from '../../../lib/guards';
import ComponentService from '../../../services/Component.service';

const api = handler();

api.post(authGuard, roleGuard('ADMIN'), async (req, res) => {
  const result = await ComponentService.rejectComponent(
    req.user,
    req.body.componentId,
    req.body.reason
  );

  res.send(result);
});

export default api;
