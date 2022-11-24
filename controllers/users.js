const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: {exclude: ['username']},
    include: {
      model: Blog
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  let where = {}
  if (req.query.read) {
    read = req.query.read
    where = {read: read}
  }
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
      },
      {
        model: Blog,
        as: 'readings',
        through: {
					attributes: ["id", "read"],
          where: where
				},
      }
    ]
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  if (user) {
    console.log(user)
    user.username = req.body.username
    console.log(user)
    await user.save()
  } else {
    res.status(404).end()
  }
})



module.exports = router