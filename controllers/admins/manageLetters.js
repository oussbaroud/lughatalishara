// Importing Requirements
const { connection } = require('../../config/database');
const fs = require('fs');

// Getting All Letters Function
const getAllLetters = (request, response) => {
    async function getData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM letters ORDER BY letter ASC";
    
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve({ data : results });
                    }
                })
            });
            // console.log(response);
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

// Selecting Letter Function
const getLetter = (request, response) => {
    const { letter } = request.params;

    async function getData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM letters WHERE letter = ?";
    
                connection.query(query, [letter], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve({ data : results });
                    }
                })
            });
            // console.log(response);
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

// Inserting Letter Function
const insertLetter = (request, response) => {
    if (request.user && request.content) {
        let { letter, file, duration } = request.body;

        async function insertData() {
            try {
                if (!letter || !file || !duration) {
                    return { error: "يرجى إدخال جميع المعلومات." };
                } else {
                    const getDataResponse = await new Promise((resolve, reject) => {
                        const query = "SELECT * FROM letters WHERE letter = ?";
            
                        connection.query(query, [letter], (err, results) => {
                            if (err) {
                                reject(new Error(err.message));
                            } else {
                                resolve(results.length);
                            }
                        })
                    });
        
                    if (getDataResponse === 0) {
                        const getNextIdResponse = await new Promise((resolve, reject) => {
                            const query = `
                                SELECT AUTO_INCREMENT
                                FROM information_schema.TABLES
                                WHERE TABLE_SCHEMA = 'lughat_alishara'
                                AND TABLE_NAME = 'letters'
                            `;
                
                            connection.query(query, (err, results) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(results);
                                }
                            })
                        });
    
                        file = getNextIdResponse[0]['AUTO_INCREMENT'] + '.' + file.split('.').pop();
                        duration = parseFloat(duration, 10);
                        
                        const insertDataResponse = await new Promise((resolve, reject) => {
                            const query = "INSERT INTO letters (letter, file, duration) VALUES (?,?,?);";
                
                            connection.query(query, [letter, file, duration] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message))
                                } else {
                                    resolve({ success: true, fileName: file });
                                }
                            })
                        });
    
                        return insertDataResponse;
                    } else {
                        return { error: "يرجى إدخال حرف جديد." };
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

// Uploading Letter Translation File Function
const uploadFile = (request, response) => {
    if (request.user && request.content) {
        const { fileName } = request.params;
        const file = request.files.myfile;
    
        async function uploadData() {
            try {
                if (!file || !fileName) {
                    return { error: "يرجى إدخال جميع المعلومات." }
                } else {
                    const uploadPath = __dirname + '/../../public/letters/' + fileName;
    
                    const response = await new Promise((resolve, reject) => {    
                        file.mv(uploadPath, err => {
                            if (err) {
                                reject(new Error(err.message));
                            } else {
                                resolve({ success: true });
                            }
                        })
                    });
            
                    return response
                }
            } catch (error) {
                console.log(error);
                return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." };
            }
        }
    
        uploadData()
        .then(data => response.json(data))
        .catch(err => console.log(err));
    } else {
        response.redirect('/manage/login');
    }
}

// Deleting Letter Function
const deleteLetter = (request, response) => {
    if (request.user && request.content) {
        let { id } = request.params;

        async function deleteData() {
            try {
                if (!id) {
                    return { error: "يرجى إدخال جميع المعلومات." };
                } else {
                    id = parseInt(id, 10); 
    
                    const response = await new Promise((resolve, reject) => {
                        const query = "DELETE FROM letters WHERE id = ?";
            
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

// Deleting Letter Translation File Function
const deleteFile = (request, response) => {
    if (request.user && request.content) {
        const { fileName } = request.params;

        async function deleteData() {
            try {
                if (!fileName) {
                    return { error: "يرجى إدخال جميع المعلومات." };
                } else {
                    const deletePath =  __dirname + '/../../public/letters/' + fileName;
                
                    const response = await new Promise((resolve, reject) => {    
                        fs.unlink(deletePath, (err) => {
                            if (err) {
                                reject(new Error(err.message));
                            } else {
                                resolve({ success: true });
                            }
                        })
                    });
            
                    return response
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

// Updating Letter Function
const updateLetter = (request, response) => {
    if (request.user && request.content) {
        let { id } = request.params;
        let { file, duration } = request.body;
    
        async function updateData() {
            try {
                if (!id || !file || !duration) {
                    return { error: "يرجى إدخال جميع المعلومات." };
                } else {
                    id = parseInt(id, 10);
                    file = id + '.' + file.split('.').pop();
                    duration = parseFloat(duration, 10);
    
                    const response = await new Promise((resolve, reject) => {
                        const query = "UPDATE letters SET file = ?, duration = ? WHERE id = ?";
            
                        connection.query(query, [file, duration, id] , (err, result) => {
                            if (err) {
                                reject(new Error(err.message));
                            } else {
                                resolve(result.affectedRows);
                            }
                        })
                    });
            
                    return response === 1 ? { success: true, fileName: file } : { error: "خطأ فى تحديث قاعدة البيانات." };
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

// Searching For A Letter
const SearchForLetter = (request, response) => {
    const { letter } = request.params;

    async function filterData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM letters WHERE letter LIKE ? ORDER BY letter ASC;`;
    
                connection.query(query, ['%' + letter + '%'], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve({ data : results });
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

// Exporting Functions
module.exports = {
    getAllLetters,
    getLetter,
    insertLetter,
    uploadFile,
    deleteLetter,
    deleteFile,
    updateLetter,
    SearchForLetter,
};