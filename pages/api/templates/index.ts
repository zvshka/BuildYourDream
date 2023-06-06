import { handler } from '../../../lib/handler';
import TemplateService from '../../../services/Template.service';
import { authGuard, roleGuard } from '../../../lib/guards';

const api = handler();

api.get(async (req, res) => {
  const forms = await TemplateService.getList();
  res.send(forms);
});

api.post(authGuard(true), roleGuard('ADMIN'), async (req, res) => {
  const template = await TemplateService.create(req.body);
  res.send(template);
});

api.patch(authGuard(true), roleGuard('ADMIN'), async (req, res) => {
  const result = await TemplateService.updateMany(req.body);
  res.send(result);
});

export default api;
