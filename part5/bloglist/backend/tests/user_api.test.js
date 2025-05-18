const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  let userObject = new User(helper.initialUsers[0])
  await userObject.save()
  userObject = new User(helper.initialUsers[1])
  await userObject.save()
})

test('users are returned as json', async () => {
  const response = await api.get('/api/users')

  assert.strictEqual(response.statusCode, 200)
  assert.match(response.headers['content-type'], /application\/json/)
})

test('all users are returned', async () => {
  const response = await api.get('/api/users')

  assert.strictEqual(response.body.length, helper.initialUsers.length)
})

test('users have id property as identifier', async () => {
  const response = await api.get('/api/users')
  const firstUser = response.body[0]
  assert.ok('id' in firstUser)
})

test('new user is created successfully', async () => {
  const user = {
    username: "user10",
    name: "User10",
    password: "Password10"
  }

  const response =
    await api.post('/api/users')
      .send(user)

  const allUsers = await User.find({})
  assert.strictEqual(allUsers.length, helper.initialUsers.length + 1)

  const userCreated = await User.findById(response.body.id)
  assert.strictEqual(userCreated.username, response.body.username)
})

test('username is mandatory for user creation', async () => {
  const user = {
    name: "User10",
    password: "Password10"
  }

  const response =
    await api.post('/api/users')
      .send(user)

  assert.strictEqual(response.statusCode, 400)

  const allUsers = await User.find({})
  assert.strictEqual(allUsers.length, helper.initialUsers.length)
})

test('username is at least 3 characters for user creation', async () => {
  const user = {
    username: "ca",
    name: "User10",
    password: "Password10"
  }

  const response =
    await api.post('/api/users')
      .send(user)

  assert.strictEqual(response.statusCode, 400)

  const allUsers = await User.find({})
  assert.strictEqual(allUsers.length, helper.initialUsers.length)
})

test('username is unique for user creation', async () => {
  const usernameAlreadyPresent = helper.initialUsers[0].username
  const user = {
    username: usernameAlreadyPresent,
    name: "User10",
    password: "Password10"
  }

  const response =
    await api.post('/api/users')
      .send(user)

  assert.strictEqual(response.statusCode, 400)

  const allUsers = await User.find({})
  assert.strictEqual(allUsers.length, helper.initialUsers.length)
})

test('password is mandatory for user creation', async () => {
  const user = {
    username: "user10",
    name: "User10"
  }

  const response =
    await api.post('/api/users')
      .send(user)

  assert.strictEqual(response.statusCode, 400)

  const allUsers = await User.find({})
  assert.strictEqual(allUsers.length, helper.initialUsers.length)
})

test('password is at least 3 characters for user creation', async () => {
  const user = {
    username: "user10",
    name: "User10",
    password: "Pc"
  }

  const response =
    await api.post('/api/users')
      .send(user)

  assert.strictEqual(response.statusCode, 400)

  const allUsers = await User.find({})
  assert.strictEqual(allUsers.length, helper.initialUsers.length)
})

after(async () => {
  await mongoose.connection.close()
})