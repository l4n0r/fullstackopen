const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const emptyList = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const blogs = [
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

describe('dummy', () => {
  test('dummy returns one', () => {

    const result = listHelper.dummy(emptyList)
    assert.strictEqual(result, 1)
  })
})

describe('favourite blog', () => {
  test('when list has no blogs, it\'s null', () => {
    const result = listHelper.favouriteBlog(emptyList)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, it\'s that blog', () => {
    const result = listHelper.favouriteBlog(listWithOneBlog)
    assert.strictEqual(result._id, "5a422aa71b54a676234d17f8")
  })

  test('when list has more than one blog, it\'s the blog with the most likes', () => {
    const result = listHelper.favouriteBlog(blogs)
    assert.strictEqual(result._id, "5a422b3a1b54a676234d17f9")
  })
})

describe('total likes', () => {
  test('when list has no blogs, it\'s 0', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has more than one blog, equals the sum of likes of each blog', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('total blogs', () => {
  test('when list has no blogs, it\'s null', () => {
    const result = listHelper.mostBlogs(emptyList)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals an object with that author name and 1', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, { [ listWithOneBlog[0].author ] : 1})
  })

  test('when list has more than one blog, equals an object with the most frequent author and the number of blogs of that author', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { "Robert C. Martin": 3 })
  })
})

describe('most likes', () => {
  test('when list has no blogs, it\'s null', () => {
    const result = listHelper.mostLikes(emptyList)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals an object with that author name and the number of likes', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, { [ listWithOneBlog[0].author ] : listWithOneBlog[0].likes})
  })

  test('when list has more than one blog, equals an object with the most liked author and the number of likes of that author', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { "Edsger W. Dijkstra": 17 })
  })
})