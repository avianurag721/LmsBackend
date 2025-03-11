const express = require('express');
const router = express.Router();
const testController = require('../controller/testController'); // Adjust the path as needed
// router.post('/create-test', testController.createTest);
router.post('/create-test', (testController.createTest));
router.get('/search', testController.searchTest);
router.get('/get-all-test', testController.getAllTests);
router.get('/get-test-byId/:id', testController.getTestById);
router.put('/update-test-byId/:id', testController.updateTest);
router.delete('/delete/:id', testController.deleteTest);

module.exports = router;
