const express = require('express');
const router = express.Router();

const commentsController = require('../controllers/comments');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', commentsController.getAll);
router.get('/:id', commentsController.getSingle);
router.post('/', isAuthenticated, commentsController.validateComment ,commentsController.createcomment);
router.put('/:id', isAuthenticated, commentsController.validateComment ,commentsController.updatecomment);
router.delete('/:id', isAuthenticated, commentsController.deletecomment);

module.exports = router;