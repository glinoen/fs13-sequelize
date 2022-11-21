const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: '%'+req.query.search+'%'
          }
        },
        {
          author: {
            [Op.iLike]: '%'+req.query.search+'%'
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  console.log(JSON.stringify(blogs))
  res.json(blogs)
})

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id})
    return res.json(blog)
  } catch(error) {
    next(error)
  }
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if (req.blog.userId === user.id) {
      await req.blog.destroy()
      res.status(204).end()
    } else {
      return res.status(400).json({ error })
    }
  } catch(error) {
    next(error)
  }
  
})

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog.likes)
    } else {
      res.status(404).end()
    }
  } catch(error) {
    next(error)
  }
  
})



module.exports = router