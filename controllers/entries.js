const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDataBase().db().collection('entries').find();
    const entries = await result.toArray();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving entries', error });
  }
};

const getSingle = async (req, res) => {
  try {
    const entryId = new ObjectId(req.params.id);
    const entry = await mongodb.getDataBase().db().collection('entries').findOne({ _id: entryId });
    if (entry) {
      res.status(200).json(entry);
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving entry', error });
  }
};

const createEntry = async (req, res) => {
  const entry = {
    userId: req.body.userId,
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    createdAt: new Date(),
    mood : req.body.mood
  };

  try {
    const response = await mongodb.getDataBase().db().collection('entries').insertOne(entry);
    res.status(201).json({ message: 'Entry created', id: response.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating entry', error });
  }
};

const updateEntry = async (req, res) => {
  const entryId = new ObjectId(req.params.id);
  const updatedEntry = {
    userId: req.body.userId,
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    createdAt: new Date(),
    mood : req.body.mood
  };

  try {
    const response = await mongodb.getDataBase().db().collection('entries').replaceOne({ _id: entryId }, updatedEntry);
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: 'Entry updated' });
    } else {
      res.status(404).json({ message: 'Entry not found or no changes made' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating entry', error });
  }
};

const deleteEntry = async (req, res) => {
  const entryId = new ObjectId(req.params.id);

  try {
    const response = await mongodb.getDataBase().db().collection('entries').deleteOne({ _id: entryId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Entry deleted' });
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry', error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createEntry,
  updateEntry,
  deleteEntry
};
