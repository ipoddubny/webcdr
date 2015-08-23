var router = require('express').Router();

router.use(require('./cdrs'));
router.use(require('./recordings'));
router.use(require('./summary'));

module.exports = router;
