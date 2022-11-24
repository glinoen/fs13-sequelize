const checkSession = require("../middlewares/checkSession")
const tokenExtractor = require("../middlewares/tokenExtractor")


router.delete('/', tokenExtractor, checkSession , async (req, res, next) => {
  try {
    await req.session.destroy()
    res.status(204).end()
  } catch(error) {
    next(error)
  }
  
})