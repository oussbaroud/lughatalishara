// Importing Requirements
const connection = require('../../config/database').connection;
const jwt = require('jsonwebtoken')

// LoggedIn Function
const loggedIn = async (request, response, next) => {
    // If User Not LoggedIn
    if (!request.cookies.userRegistered) {
        return next();
    
    // If User LoggedIn
    } else {
        try {
            // Verifying Cookie
            const decoded = jwt.verify(request.cookies.userRegistered, process.env.JWT_SECRET, (err, res) => {
                if (err) {
                    return false;
                } else {
                    return res;
                }
            });
            
            // If Error Happened When Verifying Token
            if (!decoded) {
                response.clearCookie('userRegistered');
                return next();
            
            // If No Error Happened When Verifying Token
            } else {
                // Getting User Data
                connection.query('SELECT id FROM users WHERE id = ?', [decoded.id], (error, result) => {
                    // If Error Happened When Getting User Data
                    if (error) {
                        new Error(error.message);
                    
                    // If No Error Happened When Getting User Data
                    } else {
                        // If User Not Found
                        if (!result[0]) {
                            return next();
                        } else {
                            // Assigning User
                            request.user = result[0];
                            request.userId = result[0]['id'];
                            request.userRegDate = result[0]['registrationDate'];
                            return next();
                        }
                    }
                })
            }

        // Catching Error
        } catch (error) {
            console.log(error);
            return response.json({ error: "خطأ فى إنشاء اتصال بقاعدة البيانات." });
        }
    }
}

// Exporting LoggedIn Function
module.exports = loggedIn;