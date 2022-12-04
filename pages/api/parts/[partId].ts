import { handler } from '../../../lib/handler';
import PartService from '../../../services/Part.service';

const api = handler();

api.get(async (req, res) => {
  const part = await PartService.getPartById(req.query.partId as string);
  res.send(part);
});

api.patch(async (req, res) => {
  const part = await PartService.updatePartById(req.query.partId as string, req.body);
  res.send(part);
});

export default api;
