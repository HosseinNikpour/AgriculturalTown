const express = require('express');
const router = express.Router();

/* API routes */
router.use('/BaseInfo', require('./BaseInfoRoutes'));
router.use('/Company', require('./CompanyRoutes'));
router.use('/User', require('./UserRoutes'));
router.use('/PermissionStructure', require('./PermissionStructureRoutes'));
router.use('/Town', require('./TownRoutes'));
router.use('/Contract', require('./ContractRoutes'));
router.use('/Project', require('./ProjectRoutes'));

module.exports = router;