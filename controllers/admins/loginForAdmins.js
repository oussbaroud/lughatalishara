// Importing Requirements
const connection = require('../../config/database').connection;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LogIn Function
const login = async (request, response) => {
    // Declaring Email And Password
    const { email, password } = request.body;

    try {
        // If User Didn't Enter Email Or Password
        if(!email || !password){
            response.json({ error: "يرجى إدخال جميع المعلومات." })

        // If User Entered Email And Password
        } else {
            // Getting Email
            connection.query('SELECT * FROM admins WHERE email = ?', [email], async (error, result) => {
                // If Error Happened When Getting Email
                if (error) {
                    new Error(error.message);
                
                // If No Error Happened When Getting Email
                } else {
                    // If Email Doesn't Exist Or Wrong Password
                    if (!result[0] || !await bcrypt.compare(password, result[0].password)){
                        return response.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." })

                    // If Email Exist
                    } else {
                        // Creating Cookie
                        const token = jwt.sign({id: result[0].id}, process.env.JWT_SECRET, {
                            expiresIn: process.env.JWT_EXPIRES
                        })
                        const cookieOptions = {
                            expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                            httpOnly: true
                        }
                        response.cookie('adminRegistered', token, cookieOptions);

                        // Returning Response
                        return response.json({ success: true })
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

// Exporting LogIn Function
module.exports = login;