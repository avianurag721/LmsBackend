const express = require('express');
const router = express.Router();
const testController = require('../controller/testController'); // Adjust the path as needed
router.post('/create-test', testController.createTest);
router.get('/', testController.getAllTests);
router.get('/:id', testController.getTestById);
router.put('/:id', testController.updateTest);
router.delete('/:id', testController.deleteTest);

module.exports = router;
