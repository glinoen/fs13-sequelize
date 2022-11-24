const { Session } = require('../models/session')

const checkSession = async (req, res, next) => {

	const session = await Session.findOne({
		where: {
			userId: req.decodedToken.id,
		}
	});

  const user = await User.findByPk(req.decodedToken.id)

  if (user.disabled) {
    await session.destroy()
    return response.status(401).json({
      error: 'account disabled'
    })
  }

	if (!session) {
    console.log("*****")
		res.status(401).send("Invalid token or expired session")
	} else {
		req.session = session
		next()
	}
}

module.exports = checkSession;