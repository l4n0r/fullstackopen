const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let favouriteBlog_ = blogs[0]
  let maxLikes = blogs[0].likes
  blogs.forEach(blog => {
    if (blog.likes > maxLikes) {
      favouriteBlog_ = blog
      maxLikes = blog.likes
    }
  })

  return favouriteBlog_
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authors = _.countBy(blogs, 'author')
  const [ author, numBlogs ] = _.maxBy(_.toPairs(authors), ([, value]) => value)
  return {
    [ author ] : numBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  let authors = {}

  _.forEach(blogs, (value) => {
    if (value.author in authors) {
      authors[value.author] += value.likes
    } else {
      authors[value.author] = value.likes
    }
  });

  const [ author, numLikes ] = _.maxBy(_.toPairs(authors), ([, value]) => value)
  
  return {
    [ author ] : numLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}