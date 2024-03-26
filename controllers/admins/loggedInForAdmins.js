// Importing Requirements
const connection = require('../../config/database').connection;
const jwt = require('jsonwebtoken')

// LoggedIn Function
const loggedIn = async (request, response, next) => {
    try {
        // If Admin Not LoggedIn
        if (!request.cookies.adminRegistered) {
            return next();

        // If Admin LoggedIn
        } else {
            // Verifying Cookie
            const decoded = jwt.verify(request.cookies.adminRegistered, process.env.JWT_SECRET, (err, res) => {
                if (err) {
                    return false;
                } else {
                    return res;
                }
            });
            
            // If Error Happened When Verifying Token
            if (!decoded) {
                response.clearCookie('adminRegistered');
                return next();
            
            // If No Error Happened When Verifying Token
            } else {
                // Getting Admin Data
                connection.query('SELECT * FROM admins WHERE id = ?', [decoded.id], (error, result) => {
                    // If Error Happened When Getting Admin Data
                    if (error) {
                        new Error(error.message);
                    
                    // If No Error Happened When Getting Admin Data
                    } else {
                        // If Admin Not Found
                        if (!result[0]) {
                            return next();
                        } else {
                            // Assigning Admin
                            request.user = result[0];

                            // If Admin Have Full Access
                            if (result[0].access == "fullaccess") {
                                request.fullAccess = "true";
                                request.stats = "true";
                                request.content = "true";
                            
                            // If Admin Don't Have Full Access
                            } else {
                                // If Admin Have Statistics And Content Access
                                if (result[0].access == "stats, content") {
                                    request.stats = "true";
                                    request.content = "true";
                                
                                // If Admin Don't Have Statistics And Content Access
                                } else {
                                    // If Admin Have Statistics Access
                                    if (result[0].access == "stats") {
                                        request.stats = "true";

                                    // If Admin Have Content Access
                                    } else if (result[0].access == "content") {
                                        request.content = "true";
                                    }
                                }
                            }

                            return next();
                        }
                    }
                })
            }
        }

    // Catching Error
    } catch (error) {
        console.log(error);
        response.json({ error: "خطأ فى إنشاء اتصال بقاعدة البيانات." });
        return next()
    }
}

// Exporting LoggedIn Function
module.exports = loggedIn;