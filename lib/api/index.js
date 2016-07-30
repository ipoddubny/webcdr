var router = require('express').Router();

router.use(require('./cdrs'));
router.use(require('./recordings'));

module.exports = router;
