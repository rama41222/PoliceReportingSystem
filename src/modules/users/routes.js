const validate = require('express-validation');
const { Router } = require('express');
const Operations = require('./operations');
const router = new Router();

router.get('/',Operations.list);
router.get('/:id',Operations.listOne);
router.post('/',Operations.create);
router.patch('/:id',Operations.edit);
router.delete('/:id',Operations.remove);

module.exports = router;
