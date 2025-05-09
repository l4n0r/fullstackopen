const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[3])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[4])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[5])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.statusCode, 200)
  assert.match(response.headers['content-type'], /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
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
  assert.strictEqual(totalBlogs.length, initialBlogs.length + 1)
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
  
  const newBlogCreated = await Blog.findById({_id: response.body.id})
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
  assert.strictEqual(totalBlogs.length, initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})