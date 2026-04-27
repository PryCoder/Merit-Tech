const jwt = require('jsonwebtoken');

function authRequired() {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const [scheme, token] = header.split(' ');

      if (scheme !== 'Bearer' || !token) {
        return res
          .status(401)
          .json({
            error: { code: 'UNAUTHORIZED', message: 'Missing Bearer token' },
          });
      }

      const secret = req.app.locals.config?.auth?.jwtSecret;
      const payload = jwt.verify(token, secret);

      req.user = {
        id: payload.sub,
        role: payload.role,
        email: payload.email,
      };

      next();
    } catch (err) {
      return res
        .status(401)
        .json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
    }
  };
}

module.exports = { authRequired };
