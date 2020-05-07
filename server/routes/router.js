const express = require('express');
const router = express.Router();

/* API routes */
router.use('/BaseInfo', require('./baseinfo/BaseInfoRoutes'));
router.use('/Operation', require('./baseinfo/OperationRoutes'));
router.use('/Period', require('./baseinfo/PeriodRoutes'));

router.use('/Company', require('./contract/CompanyRoutes'));
router.use('/Town', require('./contract/TownRoutes'));
router.use('/Contract', require('./contract/ContractRoutes'));
router.use('/Project', require('./contract/ProjectRoutes'));
router.use('/Extension', require('./contract/ExtensionRoutes'));

router.use('/User', require('./perm/UserRoutes'));
router.use('/PermissionStructure', require('./perm/PermissionStructureRoutes'));

router.use('/Delivery', require('./delivery/DeliveryRoutes'));
router.use('/TempDelivery', require('./delivery/TempDeliveryRoutes'));

router.use('/WBS', require('./execution/WBSRoutes'));
router.use('/WeeklyOperation', require('./execution/WeeklyOperationRoutes'));
router.use('/WeeklyOperationDetail', require('./execution/WeeklyOperationDetailRoutes'));




module.exports = router;