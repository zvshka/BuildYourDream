import { handler } from '../../../../lib/handler';
import PartService from '../../../../services/Component.service';

const api = handler();

api.get(async (req, res) => {
  const parts = await PartService.getListByTemplate(req.query.formId as string);
  res.send(parts);
});

export default api;
