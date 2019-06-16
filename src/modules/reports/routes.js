const validate = require('express-validation');
const { Router } = require('express');
const Operations = require('./operations');
const Validation = require('./validation');
const router = new Router();

router.get('/', validate(Validation.list), Operations.list);
router.get('/:id', validate(Validation.id), Operations.listOne);
router.post('/', validate(Validation.create), Operations.create);
router.patch('/:id',validate(Validation.edit), Operations.edit);
router.patch('/:id/resolve', validate(Validation.id), Operations.resolve);
router.delete('/:id', validate(Validation.id), Operations.remove);

module.exports = router;
