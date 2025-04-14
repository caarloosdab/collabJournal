const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const { body, validationResult } = require('express-validator');

const getAll = async (req, res) => {
    //#swagger.tags=['goals']
    try {
        const result = await mongodb.getDataBase().db().collection('goals').find({});
        const goals = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving goals', error });
    }
};

const getSingle = async (req, res) => {
    try {
        const goalId = new ObjectId(req.params.id);
        const result = await mongodb.getDataBase().db().collection('goals').findOne({ _id: goalId });
        if (result) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'goal not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving goal', error });
    }
};

const creategoal = async (req, res) => {
    //#swagger.tags=['goals']
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //#swagger.tags=['goals']
    try {
        const goal = {
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            dueDate: new Date(req.body.dueDate),
            priority: req.body.priority,
            createdAt: new Date()
        };
        const response = await mongodb.getDataBase().db().collection('goals').insertOne(goal);
        if (response.acknowledged) {
            res.status(201).json({ message: 'goal created successfully' });
        } else {
            res.status(500).json({ message: 'Error creating goal' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating goal', error });
    }
};

const updategoal = async (req, res) => {
    //#swagger.tags=['goals']
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //#swagger.tags=['goals']
    try {
        const goalId = new ObjectId(req.params.id);
        const goal = {
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            dueDate: new Date(req.body.dueDate),
            priority: req.body.priority,
            createdAt: new Date()
        };
        const response = await mongodb.getDataBase().db().collection('goals').replaceOne({ _id: goalId }, goal);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'goal updated successfully' });
        } else {
            res.status(404).json({ message: 'goal not found or no changes made' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating goal', error });
    }
};

const deletegoal = async (req, res) => {
    //#swagger.tags=['goals']
    try {
        const goalId = new ObjectId(req.params.id);
        const response = await mongodb.getDataBase().db().collection('goals').deleteOne({ _id: goalId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'goal deleted successfully' });
        } else {
            res.status(404).json({ message: 'goal not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting goal', error });
    }
};

const validateGoal = [
    body('userId')
        .notEmpty().withMessage('userId is required')
        .isString().withMessage('userId must be a string'),
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['pending', 'in progress', 'completed']).withMessage('Invalid status'),
    body('dueDate')
        .notEmpty().withMessage('Due date is required')
        .isISO8601().toDate().withMessage('Due date must be a valid date'),
    body('priority')
        .notEmpty().withMessage('Priority is required')
        .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high')
];

module.exports = {
    getAll,
    getSingle,
    creategoal,
    updategoal,
    deletegoal,
    validateGoal
}