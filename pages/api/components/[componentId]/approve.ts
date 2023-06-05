import { handler } from '../../../../lib/handler';
import { authGuard, roleGuard } from '../../../../lib/guards';
import ComponentService from '../../../../services/Component.service';

const api = handler();

api.get(authGuard, roleGuard('ADMIN'), async (req, res) => {
  const result = await ComponentService.approveComponent(req.user, req.query.componentId as string);
  res.send(result);
});
export default api;
