const request = require('supertest');
const express = require('express');
const usersRouter = require('../routes/users');
const mongodb = require('../data/database');

// Mock Express app
const app = express();
app.use(express.json());

// Mock the isAuthenticated middleware to always pass
jest.mock('../middleware/authenticate', () => ({
  isAuthenticated: (req, res, next) => next()
}));

// Mock database functions
const mockDb = {
  collection: jest.fn()
};

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

app.use('/users', usersRouter);

describe('Users Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /users - getAll', async () => {
    mockCollection.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue([{ name: 'Test User' }])
    });

    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ name: 'Test User' }]);
  });

  test('GET /users/:id - getSingle', async () => {
    const userId = '507f191e810c19729de860ea';
    mockCollection.findOne.mockResolvedValue({ _id: userId, name: 'Single User' });

    const res = await request(app).get(`/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Single User');
  });

  test('POST /users - createUser', async () => {
    mockCollection.insertOne.mockResolvedValue({ acknowledged: true });

    const newUser = {
      name: 'New User',
      email: 'new@example.com',
      oauthId: 'oauth123',
      role: 'user',
      createdAt: new Date().toISOString(),
      profilePicture: 'http://example.com/pic.jpg'
    };

    const res = await request(app).post('/users').send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User created successfully');
  });

  test('PUT /users/:id - updateUser', async () => {
    const userId = '507f191e810c19729de860ea';
    mockCollection.replaceOne.mockResolvedValue({ modifiedCount: 1 });

    const updatedUser = {
      name: 'Updated User',
      email: 'updated@example.com',
      oauthId: 'oauth123',
      role: 'admin',
      createdAt: new Date().toISOString(),
      profilePicture: 'http://example.com/updated.jpg'
    };

    const res = await request(app).put(`/users/${userId}`).send(updatedUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User updated successfully');
  });

  test('DELETE /users/:id - deleteUser', async () => {
    const userId = '507f191e810c19729de860ea';
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const res = await request(app).delete(`/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });
});
