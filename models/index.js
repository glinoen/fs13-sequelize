const Blog = require('./blog')
const Readinglist = require('./readinglist')
const User = require('./user')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: Readinglist })
User.belongsToMany(Blog, { through: Readinglist, as: "readings" })

module.exports = {
  Blog, User
}