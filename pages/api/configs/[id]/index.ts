import { handler } from '../../../../lib/handler';
import ConfigService from '../../../../services/Config.service';

const api = handler();

api.get(async (req, res) => {
  const data = await ConfigService.getConfigById(req.query.id as string);
  res.send(data);
});

export default api;
