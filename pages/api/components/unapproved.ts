import { handler } from '../../../lib/handler';
import ComponentService from '../../../services/Component.service';

const api = handler();

api.get(async (req, res) => {
  const result = await ComponentService.getListUnApproved(req.query);
  res.send(result);
});

export default api;
