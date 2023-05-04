import { handler } from '../../../lib/handler';
import AuthService from '../../../services/Auth.service';
import { authGuard } from '../../../lib/guards';

const api = handler();

api.get(authGuard, async (req, res) => {
  const body = await AuthService.exchange(req.token);
  res.status(200).json(body);
});

export default api;
