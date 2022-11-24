const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const checkSession = require('../middlewares/checkSession')
const tokenExtractor = require('../middlewares/tokenExtractor')

const { Blog, User } = require('../models')
const Readinglist = require('../models/readinglist')
const { SECRET } = require('../util/config')

router.post('/', tokenExtractor, checkSession, async (req, res, next) => {
  try {
    if (req.decodedToken.id === Number(req.body.userId)) {
      const user = await User.findByPk(req.body.userId)
      const blog = await Blog.findByPk(req.body.blogId)
      if (user && blog) {
        const readingList = await Readinglist.create({userId: user.id, blogId: blog.id})
        return res.json(readingList)
      }
    }
  } catch(error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, checkSession, async (req, res, next) => {
  try {
    const readingList = await Readinglist.findByPk(req.params.id)
    if (req.decodedToken.id === readingList.userId) {
      readingList.read = req.body.read
      await readingList.save()
      return res.json(readingList)
    }
  } catch(error) {
    next(error)
  }
})

module.exports = router