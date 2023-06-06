import { handler } from '../../../../lib/handler';
import AuthService from '../../../../services/Auth.service';
import { authGuard } from '../../../../lib/guards';

const api = handler();

api.get(authGuard(false), async (req, res) => {
  const result = await AuthService.sendVerify(req.user);
  res.send(result);
});

export default api;
