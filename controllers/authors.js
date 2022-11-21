const router = require('express').Router()
const sequelize = require('sequelize')

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  try {
    const authors = await Blog.findAll({
      group: ["author"],
      attributes: [
        "author",
        [sequelize.fn("COUNT", sequelize.col("title")), "articles"],
        [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
      ],
      order: [[sequelize.fn("max", sequelize.col("likes")), "DESC"]], 
    });
    res.json(authors);
  } catch(error) {
    console.log(error)
  }
})

module.exports = router