import { handler } from '../../../lib/handler';
import { authGuard, roleGuard } from '../../../lib/guards';
import UserService from '../../../services/User.service';

const api = handler();

api.get(authGuard(true), roleGuard('ADMIN'), async (req, res) => {
  const result = await UserService.getList(req.query);
  res.send(result);
});

export default api;
