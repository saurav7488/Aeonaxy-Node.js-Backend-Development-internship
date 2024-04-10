const jwt = require('jsonwebtoken')
require('dotenv').config();

let { SECRET_KEY} = process.env;



const checkAuthenticatedUser = async (req, res, next) => {
    let token;
    const { authorization } = req.headers
    if (authorization && authorization.startsWith("Bearer")) {
        try {
              token = authorization.split(" ")[1] 
            //   console.log(token)
             const decoded = jwt.verify(token,SECRET_KEY) 
             if (!decoded || !decoded.id) {
                throw new Error("Invalid token");
            }
            req.user = decoded; 
            next();
        } catch (error) {
            return res.status(404).json({messasge:"Unthorised user"})
        }
    }
    else {
        return res.status(404).json({messasge:"Unthorised user"})
    }
}


module.exports = checkAuthenticatedUser
