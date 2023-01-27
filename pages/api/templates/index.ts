import { handler } from '../../../lib/handler';
import FormService from '../../../services/Template.service';

const api = handler();

api.get(async (req, res) => {
  const forms = await FormService.getList();
  res.send(forms);
});

api.post(async (req, res) => {
  const form = await FormService.create(req.body);
  res.send(form);
});

export default api;
