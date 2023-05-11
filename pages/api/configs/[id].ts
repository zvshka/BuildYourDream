import { handler } from '../../../lib/handler';

const api = handler();

api.get(async (req, res) => {
  res.send({});
});

export default api;
