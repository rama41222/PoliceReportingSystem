const validate = require('express-validation');
const { Router } = require('express');
const Operations = require('./operations');
const validation = require('./validation');
const router = new Router();

router.get('/',Operations.list);
router.get('/:id',Operations.listOne);
router.post('/',Operations.create);
router.patch('/:id',Operations.edit);
router.patch('/:id/resolve',Operations.resolve);
router.delete('/:id',Operations.remove);

module.exports = router;
