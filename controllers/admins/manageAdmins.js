const { connection } = require('../../dbService');
const bcrypt = require('bcryptjs');

// Get all admins
const getAdmins = (request, response) => {
    async function getData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, name, email, fullaccess FROM admins;";
    
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

// Register admin
const insertAdmin = async (request, response) => {
    const { name, email, password, fullAccess } = request.body;

    async function insertData() {
        try {
            if (!name || !email || !password || !fullAccess) {
                return {
                    status: "error",
                    error: "يرجى إدخال جميع المعلومات."
                }
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
                    return { error: "تم التسجيل بنفس البريد الإلكتروني من قبل." }
                } else {
                    const username = email;
                    const hashedPassword = await bcrypt.hash(password, 8);
    
                    const insertDataResponse = await new Promise((resolve, reject) => {
                        const query = "INSERT INTO admins SET ?";
                        const set = {
                            name: name,
                            email: email,
                            username: username,
                            password: hashedPassword,
                            fullaccess: fullAccess
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
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
        }
    }
    insertData()
    .then(data => response.json(data))
    .catch(err => console.log(err));
}

// Delete admin
const deleteAdmin = (request, response) => {
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
}

// Get admin access
const getAdminAccess = (request, response) => {
    let { id } = request.params;

    async function getData() {
        try {
            if (!id) {
                return { error: "يرجى إدخال جميع المعلومات." };
            } else {
                id = parseInt(id, 10); 

                const response = await new Promise((resolve, reject) => {
                    const query = "SELECT fullaccess FROM admins WHERE id = ?";
        
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
}

// Update admin access
const updateAdminAccess = (request, response) => {
    let { id } = request.params;
    const { fullAccess } = request.body;

    async function updateData() {
        try {
            if (!id || !fullAccess) {
                return { error: "يرجى إدخال جميع المعلومات." };
            } else {
                id = parseInt(id, 10); 

                const response = await new Promise((resolve, reject) => {
                    const query = "UPDATE admins SET fullaccess = ? WHERE id = ?";
        
                    connection.query(query, [fullAccess, id] , (err, result) => {
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
}

// Search for admin
const searchForAdmin = (request, response) => {
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
}

module.exports = {
    getAdmins,
    insertAdmin,
    deleteAdmin,
    getAdminAccess,
    updateAdminAccess,
    searchForAdmin,
};