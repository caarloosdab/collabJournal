const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

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

module.exports = {
    getAll,
    getSingle,
    creategoal,
    updategoal,
    deletegoal
};