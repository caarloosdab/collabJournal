const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const result = await mongodb.getDataBase().db().collection('users').find({});
        const users = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

const getSingle = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDataBase().db().collection('users').findOne({ _id: userId });
        if (result) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
};

const createUser = async (req, res) => { 
    //#swagger.tags=['Users']
    try {
        const user = {
            name: req.body.name,
            email: req.body.email,
            oauthId: req.body.oauthId,
            role: req.body.role,
            createdAt: req.body.createdAt,
            profilePicture: req.body.profilePicture
        };
        const response = await mongodb.getDataBase().db().collection('users').insertOne(user);
        if (response.acknowledged) {
            res.status(201).json({ message: 'User created successfully' });
        } else {
            res.status(500).json({ message: 'Error creating user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const userId = new ObjectId(req.params.id);
        const user = {
            name: req.body.name,
            email: req.body.email,
            oauthId: req.body.oauthId,
            role: req.body.role,
            createdAt: req.body.createdAt,
            profilePicture: req.body.profilePicture
        };
        const response = await mongodb.getDataBase().db().collection('users').replaceOne({ _id: userId }, user);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found or no changes made' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDataBase().db().collection('users').deleteOne({ _id: userId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};