import { handler } from '../../../lib/handler';
import { authGuard } from '../../../lib/guards';

const api = handler();

api.post(authGuard, async (req, res) => {
  res.send({});
});

export default api;
