import { handler } from '../../../../lib/handler';
import AuthService from '../../../../services/Auth.service';

const api = handler();

api.post(async (req, res) => {
  const result = await AuthService.handleReset(req.query.code as string, req.body);
  res.send(result);
});

export default api;
