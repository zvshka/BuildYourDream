import { handler } from '../../../../../lib/handler';
import ComponentService from '../../../../../services/Component.service';

const api = handler();

api.get(async (req, res) => {
  const { templateId, ...filters } = req.query;
  const parts = await ComponentService.getListByTemplate(req.query.templateId as string, filters);
  res.send(parts);
});

export default api;
