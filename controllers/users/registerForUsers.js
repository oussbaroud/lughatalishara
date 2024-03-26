// Importing Requirements
const connection = require('../../config/database').connection;
const bcrypt = require('bcryptjs');

// Registering Function
const register = async (request, response) => {
    // Declaring Constents
    const { name, email, password } = request.body;
    
    try {
        // If User Didn't Enter A Requirement
        if (!email || !password) {
            response.json({ error: "يرجى إدخال جميع المعلومات." })
        
        // If User Entered All Requirements
        } else {
            // Getting Email
            connection.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
                // If Error Happened When Getting Email
                if (error) {
                    new Error(error.message);
                
                // If No Error Happened When Getting Email
                } else {
                    // If Email Exist
                    if (result[0]) {
                        return response.json({ error: "تم التسجيل بنفس البريد الإلكتروني من قبل." })
                    
                    // If Email Doesn't Exist
                    } else {
                        // Getting Next Id
                        const getNextIdResponse = await new Promise((resolve, reject) => {
                            const query = `
                                SELECT AUTO_INCREMENT
                                FROM information_schema.TABLES
                                WHERE TABLE_SCHEMA = 'lughat_alishara'
                                AND TABLE_NAME = 'users'
                            `;
                
                            connection.query(query, (err, results) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(results);
                                }
                            })
                        });

                        // Declaring Constants
                        const username = 'DZ' + getNextIdResponse[0]['AUTO_INCREMENT'];
                        const hashedPassword = await bcrypt.hash(password, 8);
                        
                        // Inserting User
                        connection.query('INSERT INTO users SET ?', {
                            name: name,
                            email: email,
                            username: username,
                            password: hashedPassword
                        }, async (error2, result2) => {
                            // If Error Happened When Inserting User
                            if (error2) {
                                new Error(error2.message);
                            
                            // If No Error Happened When Inserting User
                            } else {
                                return response.json({ success: "تم إنشاء الحساب بنجاح، أنقر هنا لتسجيل الدخول." })
                            }
                        })
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

// Exporting Register Function
module.exports = register;