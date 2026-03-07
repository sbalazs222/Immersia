import { verifyRefreshToken } from '../../utils/jwt.js';
import { ApiError } from '../../utils/apiError.js';
import pool from '../../config/mysql.js';

async function Refresh(refreshToken) {
  if (!refreshToken) throw new ApiError(401, 'NO_REFRESH_TOKEN');
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) throw new ApiError(401, 'INVALID_REFRESH_TOKEN');

  const [users] = await pool.query('SELECT token_version FROM users WHERE id = ?', [decoded.id]);
  const user = users[0];
  if (!user || decoded.tv !== user.token_version) throw new ApiError(401, 'REFRESH_TOKEN_REVOKED');

  return decoded;
}

export default Refresh;
