const connection = require('../dbService').connection;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (request, response) => {
    const { email, password } = request.body;
    if(!email || !password){
        response.json({
            status: "error",
            error: "يرجى إدخال جميع المعلومات."
        })
    }else{
        connection.query('SELECT * FROM admins WHERE email = ?', [email], async (error, result) => {
            if(error){
                throw error
            }else if(!result[0] || !await bcrypt.compare(password, result[0].password)){
                return response.json({
                    status: "error",
                    error: "البريد الإلكتروني أو كلمة المرور غير صحيحة."    
                })
            }else{
                const token = jwt.sign({id: result[0].id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES
                })
                const cookieOptions = {
                    expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                response.cookie('userRegistered', token, cookieOptions);
                return response.json({
                    status: "success",
                    success: "تم تسجيل الدخول بنجاح."
                })
            }
        })
    }
}

module.exports = login;