import { handler } from '../../../lib/handler';
import UserService from '../../../services/User.service';
import { authGuard, roleGuard } from '../../../lib/guards';

const api = handler();

api.get(authGuard, roleGuard('ADMIN'), async (req, res) => {
  const data = await UserService.getList();
  res.send(data.map(({ hashedPassword, ...user }) => user));
});

export default api;
