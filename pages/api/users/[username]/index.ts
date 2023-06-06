import { handler } from '../../../../lib/handler';
import UserService from '../../../../services/User.service';

const api = handler();

api.get(async (req, res) => {
  const result = await UserService.findOneByUsername(req.query.username as string, true);
  res.send(result);
});

export default api;
