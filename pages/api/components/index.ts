import { handler } from '../../../lib/handler';
import PartService from '../../../services/Component.service';

const api = handler();

api.post(async (req, res) => {
  const partData = await PartService.create(req.body);
  res.send(partData);
});

export default api;
