import { handler } from '../../../../lib/handler';
import FormService from '../../../../services/Template.service';
import { authGuard } from '../../../../lib/guards';

const api = handler();

api.get(async (req, res) => {
  const template = await FormService.getTemplateById(req.query.templateId as string);
  res.send(template);
});

api.patch(authGuard(true), async (req, res) => {
  const template = await FormService.updateTemplateById(req.user, {
    id: req.query.templateId as string,
    data: req.body,
  });
  res.send(template);
});

export default api;
