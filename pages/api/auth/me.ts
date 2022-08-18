import { handler } from '../../../lib/handler';
import { ApiError } from '../../../lib/ApiError';
import AuthService from '../../../services/Auth.service';

const api = handler();

api.get(async (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) throw ApiError.UnauthorizedError();
  const [type, token] = tokenHeader.split(' ');
  if (type.toLowerCase() !== 'bearer') throw ApiError.UnauthorizedError();
  if (!token) throw ApiError.UnauthorizedError();
  const body = await AuthService.exchange(token);
  res.status(200).json(body);
});

export default api;
