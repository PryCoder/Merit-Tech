const { authService } = require('../services');

async function register(req, res, next) {
  try {
    const result = await authService.register({
      ...req.body,
      config: req.app.locals.config,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login({
      ...req.body,
      config: req.app.locals.config,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const result = await authService.me({
      userId: req.user?.id,
      config: req.app.locals.config,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const result = await authService.updateProfile({
      userId: req.user?.id,
      profile: req.body,
      config: req.app.locals.config,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me, updateProfile };
