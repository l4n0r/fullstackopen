const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[3])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[4])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[5])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.statusCode, 200)
  assert.match(response.headers['content-type'], /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs have id property as identifier', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]
  assert.ok('id' in firstBlog)
})

test('new blog is created successfully', async () => {
  const blog = {
    title: "New blogs",
    author: "Miccl Peorc",
    url: "None",
    likes: 3
  }
  const response =
    await api.post('/api/blogs')
      .send(blog)

  const totalBlogs = await Blog.find({})
  assert.strictEqual(totalBlogs.length, helper.initialBlogs.length + 1)
})

test('new blog likes default to 0', async () => {
  const blog = {
    title: "New blogs",
    author: "Miccl Peorc",
    url: "None"
  }
  const response =
    await api.post('/api/blogs')
      .send(blog)

  const newBlogCreated = await Blog.findById({ _id: response.body.id })
  assert.strictEqual(newBlogCreated.likes, 0)
})

test('new blog requires title and url', async () => {
  const blog = {
    author: "Miccl Peorc",
    url: "None"
  }
  const response =
    await api.post('/api/blogs')
      .send(blog)
  assert.strictEqual(response.statusCode, 400)

  const totalBlogs = await Blog.find({})
  assert.strictEqual(totalBlogs.length, helper.initialBlogs.length)
})

test('deletion of blog succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map(b => b.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('update of blog succeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const numLikesBefore = blogToUpdate.likes
  
  const body = {
    likes: numLikesBefore + 1
  }

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(body).expect(204)

  const updatedBlog = await Blog.findById(blogToUpdate.id)
  const numLikesAfter = updatedBlog.likes
  assert.strictEqual(numLikesBefore, numLikesAfter - 1)
})

after(async () => {
  await mongoose.connection.close()
})