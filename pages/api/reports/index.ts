import { handler } from '../../../lib/handler';
import { authGuard, roleGuard } from '../../../lib/guards';
import ReportService from '../../../services/Report.service';

const api = handler();

api.post(authGuard(true), async (req, res) => {
  const result = await ReportService.create(req.user, req.body);
  res.send(result);
});

api.get(authGuard(true), roleGuard(['ADMIN', 'MODERATOR']), async (req, res) => {
  const result = await ReportService.getList(req.query);
  res.send(result);
});

export default api;
