const { Router } = require('express');

const { register, login, me, updateProfile } = require('../controllers/auth.controller');
const { validate } = require('../validators/validate');
const { registerSchema, loginSchema, updateProfileSchema } = require('../validators/schemas');
const { authRequired } = require('../middleware/auth');

const authRoutes = Router();

authRoutes.post('/register', validate({ body: registerSchema }), register);
authRoutes.post('/login', validate({ body: loginSchema }), login);

authRoutes.get('/me', authRequired(), me);
authRoutes.put('/me/profile', authRequired(), validate({ body: updateProfileSchema }), updateProfile);

module.exports = { authRoutes };
