// Importing Requirements
const { connection } = require('../../config/database');
const bcrypt = require('bcryptjs');

// Getting All Admins Function
const getAdmins = (request, response) => {
    async function getData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM admins;";
    
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve({ data: results });
                    }
                })
            });

            return response;
        } catch (error) {
            console.log(error);
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." };
        }
    }

    getData()
    .then(data => response.json(data))
    .catch(err => console.log(err));
}

// Registering Admin Function
const insertAdmin = async (request, response) => {
    if (request.user && request.content) {
        const { name, email, password, access } = request.body;

        async function insertData() {
            try {
                if (!name || !email || !password || !access) {
                    return { error: "يرجى إدخال جميع المعلومات." };
                } else {
                    const getDataResponse = await new Promise((resolve, reject) => {
                        const query = "SELECT email FROM admins WHERE email = ?";
            
                        connection.query(query, [email], (err, results) => {
                            if (err) {
                                reject(new Error(err.message));
                            } else {
                                resolve(results.length);
                            }
                        })
                    });
    
                    if (getDataResponse > 0) {
                        return { error: "تم التسجيل بنفس البريد الإلكتروني من قبل." };
                    } else {
                        const getNextIdResponse = await new Promise((resolve, reject) => {
                            const query = `
                                SELECT AUTO_INCREMENT
                                FROM information_schema.TABLES
                                WHERE TABLE_SCHEMA = 'lughat_alishara'
                                AND TABLE_NAME = 'admins'
                            `;
                
                            connection.query(query, (err, results) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(results);
                                }
                            })
                        });

                        const username = 'DZ' + getNextIdResponse[0]['AUTO_INCREMENT'];
                        const hashedPassword = await bcrypt.hash(password, 8);
        
                        const insertDataResponse = await new Promise((resolve, reject) => {
                            const query = "INSERT INTO admins SET ?";
                            const set = {
                                name: name,
                                email: email,
                                username: username,
                                password: hashedPassword,
                                access: access
                            };
    
                            connection.query(query, set, (err, results) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve({ success: true });
                                }
                            })
                        });
    
                        return insertDataResponse;
                    }
                }
            } catch (error) {
                console.log(error);
                return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." };
            }
        }
        insertData()
        .then(data => response.json(data))
        .catch(err => console.log(err));
    } else {
        response.redirect('/manage/login');
    }
}

// Deleting Admin Function
const deleteAdmin = (request, response) => {
    if (request.user && request.content) {
        let { id } = request.params;

        async function deleteData() {
            try {
                if (!id) {
                    return { error: "يرجى إدخال جميع المعلومات." };
                } else {
                    id = parseInt(id, 10); 
    
                    const response = await new Promise((resolve, reject) => {
                        const query = "DELETE FROM admins WHERE id = ?";
            
                        connection.query(query, [id] , (err, result) => {
                            if (err) {
                                reject(new Error(err.message));
                            } else {
                                resolve(result.affectedRows);
                            }
                        })
                    });
            
                    return response === 1 ? { success: true } : { error: "خطأ فى الحذف من قاعدة البيانات." };
                }
            } catch (error) {
                console.log(error);
                return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." };
            }
        }
    
        deleteData()
        .then(data => response.json(data))
        .catch(err => console.log(err));
    } else {
        response.redirect('/manage/login');
    }
}

// Getting Admin Access Function
const getAdminAccess = (request, response) => {
    if (request.user && request.content) {
        let { id } = request.params;

        async function getData() {
            try {
                if (!id) {
                    return { error: "يرجى إدخال جميع المعلومات." };
                } else {
                    id = parseInt(id, 10); 
    
                    const response = await new Promise((resolve, reject) => {
                        const query = "SELECT access FROM admins WHERE id = ?";
            
                        connection.query(query, [id] , (err, result) => {
                            if (err) {
                                reject(new Error(err.message));
                            } else {
                                resolve({ data: result });
                            }
                        })
                    });
        
                    return response;
                }
            } catch (error) {
                console.log(error);
                return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." };
            }
        }
    
        getData()
        .then(data => response.json(data))
        .catch(err => console.log(err));
    } else {
        response.redirect('/manage/login');
    }
}

// Updating Admin Access Function
const updateAdminAccess = (request, response) => {
    if (request.user && request.content) {
        let { id } = request.params;
        const { access } = request.body;
    
        async function updateData() {
            try {
                if (!id || !access) {
                    return { error: "يرجى إدخال جميع المعلومات." };
                } else {
                    id = parseInt(id, 10); 
    
                    const response = await new Promise((resolve, reject) => {
                        const query = "UPDATE admins SET access = ? WHERE id = ?";
            
                        connection.query(query, [access, id] , (err, result) => {
                            if (err) {
                                reject(new Error(err.message));
                            } else {
                                resolve(result.affectedRows);
                            }
                        })
                    });
            
                    return response === 1 ? { success: true } : { error: "خطأ فى تحديث قاعدة البيانات." };
                }
            } catch (error) {
                console.log(error);
                return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." };
            }
        }
    
        updateData()
        .then(data => response.json(data))
        .catch(err => console.log(err));
    } else {
        response.redirect('/manage/login');
    }
}

// Searching For Admin Function
const searchForAdmin = (request, response) => {
    if (request.user && request.content) {
        const { name } = request.params;

        async function filterData() {
            try {
                const response = await new Promise((resolve, reject) => {
                    const query = `SELECT * FROM admins WHERE name LIKE ? ORDER BY name ASC;`;
        
                    connection.query(query, ['%' + name + '%'], (err, results) => {
                        if (err) {
                            reject(new Error(err.message));
                        } else {
                            resolve({ data: results });
                        }
                    })
                });
        
                return response;
            } catch (error) {
                console.log(error);
                return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." };
            }
        }
    
        filterData()
        .then(data => response.json(data))
        .catch(err => console.log(err));
    } else {
        response.redirect('/manage/login');
    }
}

// Exporting Functions
module.exports = {
    getAdmins,
    insertAdmin,
    deleteAdmin,
    getAdminAccess,
    updateAdminAccess,
    searchForAdmin,
};