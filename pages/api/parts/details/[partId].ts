import { handler } from '../../../../lib/handler';
import PartService from '../../../../services/Part.service';

const api = handler();

api.get(async (req, res) => {
  const part = await PartService.getPartById(req.query.partId as string);
  res.send(part);
});

export default api;
