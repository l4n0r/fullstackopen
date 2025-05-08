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

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}