import { handler } from '../../../../lib/handler';
import { authGuard, roleGuard } from '../../../../lib/guards';
import ReportService from '../../../../services/Report.service';

const api = handler();

api.get(authGuard(true), roleGuard(['ADMIN', 'MODERATOR']), async (req, res) => {
  const result = await ReportService.reject(req.query.reportId as string);

  res.send(result);
});

export default api;
