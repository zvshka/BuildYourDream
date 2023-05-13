import { handler } from '../../../lib/handler';
import { authGuard, roleGuard } from '../../../lib/guards';
import ConstraintsService from '../../../services/Constraints.service';

const api = handler();

api.patch(authGuard, roleGuard('ADMIN'), async (req, res) => {
  const data = await ConstraintsService.update(req.query.id as string, req.body);
  res.send(data);
});

api.delete(authGuard, roleGuard('ADMIN'), async (req, res) => {
  const result = await ConstraintsService.delete(req.query.id as string);
  res.send(result);
});
export default api;
