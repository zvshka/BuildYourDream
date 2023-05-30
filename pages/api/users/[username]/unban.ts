import { handler } from '../../../../lib/handler';
import { authGuard, roleGuard } from '../../../../lib/guards';
import UserService from '../../../../services/User.service';

const api = handler();

api.get(authGuard, roleGuard(['ADMIN', 'MODERATOR']), async (req, res) => {
  const result = await UserService.unban(req.query.username as string);
  res.send(result);
});

export default api;
