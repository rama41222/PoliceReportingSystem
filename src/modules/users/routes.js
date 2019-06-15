const Operations = require('./operations');
const { Router } = require('express');
const router = new Router();

router.get('/health',Operations.health);

module.exports = router;
