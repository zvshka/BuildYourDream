import { handler } from '../../../lib/handler';
import AuthService from '../../../services/Auth.service';

const api = handler();

api.post(async (req, res) => {
  const body = await AuthService.signup(req.body);
  res.status(200).json(body);
});

export default api;
