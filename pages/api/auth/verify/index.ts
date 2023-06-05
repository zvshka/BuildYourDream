import { handler } from '../../../../lib/handler';
import AuthService from '../../../../services/Auth.service';

const api = handler();

api.get(async (req, res) => {
  const result = await AuthService.handleVerify(req.query.code as string);
  res.send(result);
});

export default api;
