const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('oauthId').notEmpty().withMessage('OAuth ID is required'),
  body('role').isIn(['user', 'admin']).withMessage('Role must be either "user" or "admin"'),
  body('createdAt').optional().isISO8601().toDate().withMessage('createdAt must be a valid date'),
  body('profilePicture').optional().isURL().withMessage('Profile picture must be a valid URL'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Get all users
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

// Get a single user
const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDataBase().db().collection('users').findOne({ _id: userId });
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'user not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

// Create a user
const createUser = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const user = {
      name: req.body.name,
      email: req.body.email,
      oauthId: req.body.oauthId,
      role: req.body.role,
      createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
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

// Update a user
const updateUser = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const userId = new ObjectId(req.params.id);
    const user = {
      name: req.body.name,
      email: req.body.email,
      oauthId: req.body.oauthId,
      role: req.body.role,
      createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
      profilePicture: req.body.profilePicture
    };

    const response = await mongodb.getDataBase().db().collection('users').replaceOne({ _id: userId }, user);
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'user not found or no changes made' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDataBase().db().collection('users').deleteOne({ _id: userId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'user not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'error deleting user', error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
  validateUser
};
