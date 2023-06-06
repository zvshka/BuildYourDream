import { handler } from '../../../../lib/handler';
import AuthService from '../../../../services/Auth.service';
import { authGuard } from '../../../../lib/guards';

const api = handler();

api.get(authGuard(false), async (req, res) => {
  const body = await AuthService.exchange(req.token);
  res.status(200).json(body);
});

api.patch(authGuard(), async (req, res) => {
  const result = await AuthService.updateProfile(req.user, req.body);
  res.send(result);
});

export default api;
