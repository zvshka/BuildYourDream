import { handler } from '../../../../lib/handler';
import FormService from '../../../../services/Template.service';
import { authGuard, roleGuard } from '../../../../lib/guards';

const api = handler();

api.get(async (req, res) => {
  const template = await FormService.getFormById(req.query.templateId as string);
  res.send(template);
});

api.patch(authGuard, roleGuard('ADMIN'), async (req, res) => {
  const template = await FormService.updateFormById({
    id: req.query.templateId as string,
    data: req.body,
  });
  res.send(template);
});

export default api;
