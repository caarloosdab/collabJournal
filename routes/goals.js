const express = require('express');
const router = express.Router();

const goalsController = require('../controllers/goals');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', goalsController.getAll);
router.get('/:id', goalsController.getSingle);
router.post('/', isAuthenticated, goalsController.creategoal);
router.put('/:id', isAuthenticated, goalsController.updategoal);
router.delete('/:id', isAuthenticated, goalsController.deletegoal);

module.exports = router;