import { handler } from '../../../../lib/handler';
import { authGuard } from '../../../../lib/guards';
import ReportService from '../../../../services/Report.service';

const api = handler();

api.delete(authGuard, async (req, res) => {
  const result = await ReportService.delete(req.query.reportId as string, req.user);
  res.send(result);
});

export default api;
