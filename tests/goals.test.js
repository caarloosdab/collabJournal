const request = require('supertest');
const express = require('express');
const goalsRouter = require('../routes/goals');
const mongodb = require('../data/database');

// Create mock app
const app = express();
app.use(express.json());

// Mock auth middleware
jest.mock('../middleware/authenticate', () => ({
  isAuthenticated: (req, res, next) => next()
}));

// Mock db and collection
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

// Use router
app.use('/goals', goalsRouter);

describe('Goals Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /goals - getAll', async () => {
    mockCollection.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue([{ title: 'Test Goal' }])
    });

    const res = await request(app).get('/goals');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ title: 'Test Goal' }]);
  });

  test('GET /goals/:id - getSingle', async () => {
    const goalId = '507f1f77bcf86cd799439011';
    mockCollection.findOne.mockResolvedValue({ _id: goalId, title: 'Single Goal' });

    const res = await request(app).get(`/goals/${goalId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Single Goal');
  });

  test('POST /goals - creategoal', async () => {
    mockCollection.insertOne.mockResolvedValue({ acknowledged: true });

    const newGoal = {
      userId: 'user123',
      title: 'Finish CollabJournal',
      description: 'Wrap up CSE 341 project',
      status: 'in-progress',
      dueDate: new Date().toISOString(),
      priority: 'high'
    };

    const res = await request(app).post('/goals').send(newGoal);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('goal created successfully');
  });

  test('PUT /goals/:id - updategoal', async () => {
    const goalId = '507f1f77bcf86cd799439011';
    mockCollection.replaceOne.mockResolvedValue({ modifiedCount: 1 });

    const updatedGoal = {
      userId: 'user123',
      title: 'Update CollabJournal',
      description: 'Refactor tests',
      status: 'completed',
      dueDate: new Date().toISOString(),
      priority: 'medium'
    };

    const res = await request(app).put(`/goals/${goalId}`).send(updatedGoal);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('goal updated successfully');
  });

  test('DELETE /goals/:id - deletegoal', async () => {
    const goalId = '507f1f77bcf86cd799439011';
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const res = await request(app).delete(`/goals/${goalId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('goal deleted successfully');
  });
});
