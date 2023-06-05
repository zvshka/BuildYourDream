import { handler } from '../../../../lib/handler';
import AuthService from '../../../../services/Auth.service';

const api = handler();

api.post(async (req, res) => {
  const result = await AuthService.sendReset(req.body.toFind);
  res.send(result);
});

export default api;
