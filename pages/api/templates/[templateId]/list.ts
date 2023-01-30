import { handler } from '../../../../lib/handler';
import PartService from '../../../../services/Component.service';

const api = handler();

api.get(async (req, res) => {
  const { templateId, ...filters } = req.query;
  const parts = await PartService.getListByTemplate(req.query.templateId as string, filters);
  res.send(parts);
});

export default api;
