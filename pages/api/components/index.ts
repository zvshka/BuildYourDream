import { handler } from '../../../lib/handler';
import PartService from '../../../services/Component.service';
import { authGuard, roleGuard } from '../../../lib/guards';

const api = handler();

api.post(authGuard, roleGuard('ADMIN'), async (req, res) => {
  const partData = await PartService.create(req.body);
  res.send(partData);
});

export default api;
