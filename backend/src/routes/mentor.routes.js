const { Router } = require('express');

const { getHint } = require('../controllers/mentor.controller');
const { validate } = require('../validators/validate');
const { mentorHintSchema } = require('../validators/schemas');

const mentorRoutes = Router();

mentorRoutes.post('/hint', validate({ body: mentorHintSchema }), getHint);

module.exports = { mentorRoutes };
