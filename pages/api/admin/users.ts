import { handler } from '../../../lib/handler';
import UserService from '../../../services/User.service';

const api = handler();

api.get(async (req, res) => {
  const data = await UserService.getList();
  res.send(data.map(({ hashedPassword, ...user }) => user));
});

export default api;
