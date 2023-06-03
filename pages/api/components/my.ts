import { handler } from '../../../lib/handler';
import ComponentService from '../../../services/Component.service';

const api = handler();

api.get(async (req, res) => {
  const { username, ...query } = req.query;
  const result = await ComponentService.getListByUsername(username as string, query);
  res.send(result);
});

export default api;
