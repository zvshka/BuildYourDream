import { handler } from '../../../lib/handler';
import TemplateService from '../../../services/Template.service';

const api = handler();

api.get(async (req, res) => {
  const forms = await TemplateService.getList();
  res.send(forms);
});

api.post(async (req, res) => {
  const form = await TemplateService.create(req.body);
  res.send(form);
});

api.patch(async (req, res) => {
  const result = await TemplateService.updateMany(req.body);
  res.send(result);
});

export default api;
