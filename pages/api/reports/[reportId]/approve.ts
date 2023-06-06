import { handler } from '../../../../lib/handler';
import { authGuard, roleGuard } from '../../../../lib/guards';
import ReportService from '../../../../services/Report.service';

const api = handler();

api.post(authGuard(true), roleGuard(['ADMIN', 'MODERATOR']), async (req, res) => {
  const result = await ReportService.approve(req.user, req.query.reportId as string, req.body);
  res.send(result);
});

export default api;
