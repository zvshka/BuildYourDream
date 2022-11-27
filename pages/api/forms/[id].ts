import { handler } from '../../../lib/handler';
import FormService from '../../../services/Form.service';

const api = handler();

api.get(async (req, res) => {
  const formData = await FormService.getFormById(req.query.id as string);
  res.send(formData);
});

api.patch(async (req, res) => {
  // TODO: Validation
  const formData = await FormService.updateFormById({ id: req.query.id as string, data: req.body });
  res.send(formData);
});

export default api;
