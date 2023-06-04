import { handler } from '../../../../lib/handler';
import ReportService from '../../../../services/Report.service';

const api = handler();

api.get(async (req, res) => {
  const result = await ReportService.getUserViolations(req.query.username as string, req.query);
  res.send(result);
});

export default api;
