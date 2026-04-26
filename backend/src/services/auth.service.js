const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models/User');

function conflict(code, message) {
  const err = new Error(message);
  err.status = 409;
  err.code = code;
  return err;
}

function unauthorized(code, message) {
  const err = new Error(message);
  err.status = 401;
  err.code = code;
  return err;
}

function signToken({ user, config }) {
  const secret = config?.auth?.jwtSecret;
  const expiresIn = config?.auth?.jwtExpiresIn || '7d';

  const token = jwt.sign(
    {
      sub: String(user._id),
      role: user.role,
      email: user.email,
    },
    secret,
    { expiresIn }
  );

  return token;
}

const authService = {
  async register({ email, password, name = null, role = 'candidate', config }) {
    if (!config?.mongodb?.enabled) {
      const err = new Error('MongoDB not configured');
      err.status = 503;
      err.code = 'MONGODB_DISABLED';
      throw err;
    }

    const existing = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existing) throw conflict('EMAIL_IN_USE', 'Email is already registered');

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      name,
      role,
      passwordHash,
    });

    const token = signToken({ user, config });

    return {
      user: user.toJSON(),
      token,
    };
  },

  async login({ email, password, config }) {
    if (!config?.mongodb?.enabled) {
      const err = new Error('MongoDB not configured');
      err.status = 503;
      err.code = 'MONGODB_DISABLED';
      throw err;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) throw unauthorized('INVALID_CREDENTIALS', 'Invalid email or password');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw unauthorized('INVALID_CREDENTIALS', 'Invalid email or password');

    const token = signToken({ user, config });

    return {
      user: user.toJSON(),
      token,
    };
  },

  async me({ userId, config }) {
    if (!config?.mongodb?.enabled) {
      const err = new Error('MongoDB not configured');
      err.status = 503;
      err.code = 'MONGODB_DISABLED';
      throw err;
    }

    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    return { user: user.toJSON() };
  },

  async updateProfile({ userId, profile, config }) {
    if (!config?.mongodb?.enabled) {
      const err = new Error('MongoDB not configured');
      err.status = 503;
      err.code = 'MONGODB_DISABLED';
      throw err;
    }

    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    if (profile?.name !== undefined) user.name = profile.name;
    if (profile?.resumeUrl !== undefined) user.resumeUrl = profile.resumeUrl;
    if (profile?.githubUrl !== undefined) user.githubUrl = profile.githubUrl;
    if (profile?.portfolioUrl !== undefined) user.portfolioUrl = profile.portfolioUrl;

    await user.save();
    return { user: user.toJSON() };
  },
};

module.exports = { authService };
