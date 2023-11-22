const connection = require('../dbService').connection;
const bcrypt = require('bcryptjs');

const register = async (request, response) => {
    const { fullname, email, password } = request.body;
    if(!email || !password){
        response.json({
            status: "error",
            error: "يرجى إدخال جميع المعلومات."
        })
    }else{
        connection.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
            if(error){
                throw error
            }else if(result[0]){
                return response.json({
                    status: "error",
                    error: "تم التسجيل بنفس البريد الإلكتروني من قبل."    
                })
            }else{
                const hashedPassword = await bcrypt.hash(password, 8);
                connection.query('INSERT INTO users SET ?', {
                    name: fullname,
                    email: email,
                    password: hashedPassword
                }, async (error2, result2) => {
                    if(error2){
                        throw error2  
                    }else{
                        return response.json({
                            status: "success",
                            success: "تم إنشاء الحساب بنجاح."    
                        })
                    }
                })
            }
        })
    }
}

module.exports = register;