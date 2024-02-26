const { connection } = require('../../dbService');
const fs = require('fs');

// Get all letters
const getAllLetters = (request, response) => {
    async function getData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM letters ORDER BY number ASC";
    
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


// Insert letter
const insertLetter = (request, response) => {
    let { number, letter, file, duration } = request.body;

    async function insertData() {
        try {
            if (!number || !letter || !file || !duration) {
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
                    const getLastIdResponse = await new Promise((resolve, reject) => {
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

                    number = parseInt(number, 10);
                    file = getLastIdResponse[0]['AUTO_INCREMENT'] + '.' + file.split('.').pop();
                    duration = parseFloat(duration, 10);
                    
                    const insertDataResponse = await new Promise((resolve, reject) => {
                        const query = "INSERT INTO letters (number, letter, file, duration) VALUES (?,?,?,?);";
            
                        connection.query(query, [number, letter, file, duration] , (err, result) => {
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
}

// Upload file
const uploadFile = (request, response) => {
    const { fileName } = request.params;
    const file = request.files.myfile;

    async function uploadData() {
        try {
            if (!file || !fileName) {
                return { error: "يرجى إدخال جميع المعلومات." }
            } else {
                const uploadPath = __dirname + '/../public/letters/' + fileName;

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
}

// Delete letter
const deleteLetter = (request, response) => {
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
}

// Fill letters gap
const fillLettersGap = async (request, response) => {
    const { currentNumbers, newNumbers } = request.body;
    console.log(currentNumbers, newNumbers);

    async function updateData(i){
        try {
            if (!currentNumbers || !newNumbers) {
                return { error: "يرجى إدخال جميع المعلومات." };
            } else {
                const response = await new Promise((resolve, reject) => {
                    const query = "UPDATE letters SET number = ? WHERE number = ?";
        
                    connection.query(query, [newNumbers[i], currentNumbers[i]] , (err, result) => {
                        if (err) {
                            reject(new Error(err.message));
                        } else {
                            resolve(result.affectedRows);
                        }
                    })
                });
        
                return response === 1 ? { success: true } : { error: "خطأ فى تحديث قاعدة البيانات. تواصل مع الفريق المطور قبل فعل أي شيء." };
            }
        } catch (error) {
            console.log(error);
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات. تواصل مع الفريق المطور قبل فعل أي شيء." };
        }
    }
    
    for(let i = 0; i < currentNumbers.length; i++){
        if(i === currentNumbers.length - 1){
            updateData(i)
            .then(data => response.json(data))
            .catch(err => console.log(err));
        }else{
            const updateDataResponse = await updateData(i);
            if (updateDataResponse.error) {
                response.json(updateDataResponse);
                break;
            }
        }
    }
}

// Delete file
const deleteFile = (request, response) => {
    const { fileName } = request.params;

    async function deleteData() {
        try {
            if (!fileName) {
                return { error: "يرجى إدخال جميع المعلومات." };
            } else {
                const deletePath =  __dirname + '/../public/letters/' + fileName;
            
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
}

// Update letter
const updateLetter = (request, response) => {
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
}

// Search for a letter
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

module.exports = {
    getAllLetters,
    insertLetter,
    uploadFile,
    deleteLetter,
    fillLettersGap,
    deleteFile,
    updateLetter,
    SearchForLetter,
};