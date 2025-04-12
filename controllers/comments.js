const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDataBase().db().collection('comments').find();
    const comments = await result.toArray();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving comments', error });
  }
};

const getSingle = async (req, res) => {
  try {
    const commentId = new ObjectId(req.params.id);
    const comment = await mongodb.getDataBase().db().collection('comments').findOne({ _id: commentId });
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.status(404).json({ message: 'comment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving comment', error });
  }
};

const createcomment = async (req, res) => {
  const comment = {
    commentId: req.body.commentId,
    userId: req.body.userId,
    text: req.body.text,
    createdAt: new Date()
  };

  try {
    const response = await mongodb.getDataBase().db().collection('comments').insertOne(comment);
    res.status(201).json({ message: 'comment created', id: response.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error });
  }
};

const updatecomment = async (req, res) => {
  const commentId = new ObjectId(req.params.id);
  const updatedcomment = {
    commentId: req.body.commentId,
    userId: req.body.userId,
    text: req.body.text,
    createdAt: new Date()
  };

  try {
    const response = await mongodb.getDataBase().db().collection('comments').replaceOne({ _id: commentId }, updatedcomment);
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: 'comment updated' });
    } else {
      res.status(404).json({ message: 'comment not found or no changes made' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error });
  }
};

const deletecomment = async (req, res) => {
  const commentId = new ObjectId(req.params.id);

  try {
    const response = await mongodb.getDataBase().db().collection('comments').deleteOne({ _id: commentId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'comment deleted' });
    } else {
      res.status(404).json({ message: 'comment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createcomment,
  updatecomment,
  deletecomment
};
