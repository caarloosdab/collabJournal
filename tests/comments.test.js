const request = require('supertest');
const express = require('express');
const commentsRouter = require('../routes/comments');
const mongodb = require('../data/database');

// Create mock app
const app = express();
app.use(express.json());

// Mock authentication middleware
jest.mock('../middleware/authenticate', () => ({
  isAuthenticated: (req, res, next) => next()
}));

// Mock MongoDB
const mockDb = { collection: jest.fn() };
const mockCollection = {
  find: jest.fn(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
  replaceOne: jest.fn(),
  deleteOne: jest.fn()
};

mongodb.getDataBase = jest.fn(() => ({
  db: () => mockDb
}));

mockDb.collection.mockReturnValue(mockCollection);

// Mount the router
app.use('/comments', commentsRouter);

describe('Comments Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /comments - getAll', async () => {
    mockCollection.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue([{ text: 'Great post!' }])
    });

    const res = await request(app).get('/comments');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ text: 'Great post!' }]);
  });

  test('GET /comments/:id - getSingle', async () => {
    const commentId = '507f1f77bcf86cd799439011';
    mockCollection.findOne.mockResolvedValue({ _id: commentId, text: 'Nice work' });

    const res = await request(app).get(`/comments/${commentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe('Nice work');
  });

  test('POST /comments - createcomment', async () => {
    const newComment = {
      commentId: '12345',
      userId: 'user1',
      text: 'Awesome journal entry!'
    };

    mockCollection.insertOne.mockResolvedValue({ insertedId: 'abc123' });

    const res = await request(app).post('/comments').send(newComment);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ message: 'comment created', id: 'abc123' });
  });

  test('PUT /comments/:id - updatecomment', async () => {
    const commentId = '507f1f77bcf86cd799439011';
    const updatedComment = {
      commentId: '12345',
      userId: 'user1',
      text: 'Updated text here'
    };

    mockCollection.replaceOne.mockResolvedValue({ modifiedCount: 1 });

    const res = await request(app).put(`/comments/${commentId}`).send(updatedComment);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('comment updated');
  });

  test('DELETE /comments/:id - deletecomment', async () => {
    const commentId = '507f1f77bcf86cd799439011';
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const res = await request(app).delete(`/comments/${commentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('comment deleted');
  });
});
