import { handler } from '../../../lib/handler';
import { authMiddleware } from '../../../lib/guards';
import UserService from '../../../services/User.service';

const api = handler();

api.get(authMiddleware, async (req, res) => {
  const result = await UserService.findOneByUsername(req.query.username as string);
  res.send(result);
});

export default api;
