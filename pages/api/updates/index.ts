import { handler } from '../../../lib/handler';
import UpdateService from '../../../services/Update.service';

const api = handler();

api.get(async (req, res) => {
  const result = await UpdateService.getList(req.query);
  res.send(result);
});

export default api;
