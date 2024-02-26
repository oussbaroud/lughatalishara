const connection = require('../../dbService').connection;
const jwt = require('jsonwebtoken')

const loggedIn = async (request, response, next) => {
    if(!request.cookies.userRegistered){
        return next();
    }else{
        try{
            const decoded = jwt.verify(request.cookies.userRegistered, process.env.JWT_SECRET);
            connection.query('SELECT id FROM users WHERE id = ?', [decoded.id], (error, result) => {
                request.user = result[0]['id'];
                return next();
            })
        }catch{
            if(error) return next()
        }
    }
}

module.exports = loggedIn;