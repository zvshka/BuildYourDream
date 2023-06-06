import { handler } from '../../../lib/handler';
import { authGuard, roleGuard } from '../../../lib/guards';
import ConstraintsService from '../../../services/Constraints.service';

const api = handler();

api.get(async (req, res) => {
  const data = await ConstraintsService.getList();
  res.send(data);
});

api.post(authGuard(true), roleGuard('ADMIN'), async (req, res) => {
  const data = await ConstraintsService.create(req.body);
  res.send(data);
});

export default api;
