const request = require('supertest');
const express = require('express');
const entriesRoutes = require('../routes/entries');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// Mock DB setup
jest.mock('../data/database');

// Set up app with routes
const app = express();
app.use(express.json());

// Mock auth middleware to always pass
jest.mock('../middleware/authenticate', () => ({
  isAuthenticated: (req, res, next) => next()
}));

app.use('/entries', entriesRoutes);

describe('Entries API', () => {
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn(),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      replaceOne: jest.fn(),
      deleteOne: jest.fn()
    };

    mongodb.getDataBase.mockReturnValue({
      db: () => ({
        collection: () => mockCollection
      })
    });
  });

  test('GET /entries should return all entries', async () => {
    const entries = [{ title: 'Entry 1' }, { title: 'Entry 2' }];
    mockCollection.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue(entries)
    });

    const res = await request(app).get('/entries');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(entries);
  });

  test('GET /entries/:id should return a single entry', async () => {
    const id = new ObjectId();
    const entry = { _id: id, title: 'Test Entry' };
    mockCollection.findOne.mockResolvedValue(entry);
  
    const res = await request(app).get(`/entries/${id}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      _id: id.toHexString(), // <-- Convert ObjectId to string
      title: 'Test Entry'
    });
  });
  

  test('POST /entries should create a new entry', async () => {
    const insertedId = new ObjectId();
    mockCollection.insertOne.mockResolvedValue({ insertedId });
  
    const newEntry = {
      userId: 'user1',
      title: 'New Title',
      content: 'Some content',
      tags: ['tag1'],
      mood: 'happy'
    };
  
    const res = await request(app).post('/entries').send(newEntry);
  
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      message: 'Entry created',
      id: insertedId.toHexString() // <-- Convert ObjectId to string
    });
  });
  

  test('PUT /entries/:id should update an entry', async () => {
    const entryId = new ObjectId();
    mockCollection.replaceOne.mockResolvedValue({ modifiedCount: 1 });

    const res = await request(app)
      .put(`/entries/${entryId}`)
      .send({
        userId: 'user1',
        title: 'Updated Title',
        content: 'Updated content',
        tags: ['updated'],
        mood: 'thoughtful'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Entry updated' });
  });

  test('DELETE /entries/:id should delete an entry', async () => {
    const entryId = new ObjectId();
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const res = await request(app).delete(`/entries/${entryId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Entry deleted' });
  });
});
