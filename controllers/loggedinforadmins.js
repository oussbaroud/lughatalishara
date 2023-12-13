const connection = require('../dbService').connection;
const jwt = require('jsonwebtoken')

const loggedIn = async (request, response, next) => {
    if(!request.cookies.userRegistered){
        return next();
    }else{
        try{
            const decoded = jwt.verify(request.cookies.userRegistered, process.env.JWT_SECRET);
            connection.query('SELECT * FROM admins WHERE id = ?', [decoded.id], (error, result) => {
                request.user = result[0];
                let checkFullAccess = result[0].fullaccess;
                return next();
            })
        }catch{
            if(error) return next()
        }
    }
}

module.exports = loggedIn;