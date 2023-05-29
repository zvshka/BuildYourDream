import { handler } from '../../../lib/handler';
import { authGuard } from '../../../lib/guards';
import ReportService from '../../../services/Report.service';

const api = handler();

api.get(authGuard, async (req, res) => {
  const result = await ReportService.getUserList(req.user, req.query);

  res.send(result);
});

export default api;
