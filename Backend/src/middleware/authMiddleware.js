const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateJWT = (req, res, next) => {
   console.log('Authenticating JWT');

   const token = req.header('Authorization');
   console.log(token);

   if (!token) return res.sendStatus(401);

   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;

      next();
   });
};

module.exports = authenticateJWT;
