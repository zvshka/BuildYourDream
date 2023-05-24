import { handler } from '../../../lib/handler';
import ComponentService from '../../../services/Component.service';
import { authGuard } from '../../../lib/guards';

const api = handler();

api.get(async (req, res) => {
  const part = await ComponentService.getComponentById(req.query.componentId as string);
  res.send(part);
});

api.patch(authGuard, async (req, res) => {
  const part = await ComponentService.updateComponentById(
    req.user,
    req.query.componentId as string,
    req.body
  );
  res.send(part);
});

export default api;
