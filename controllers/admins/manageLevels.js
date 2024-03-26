// Importing Requirements
const connection = require('../../config/database').connection;

// Getting All Levels Function
const getAllLevels = (request, response) => {
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM levels ORDER BY number ASC;";
    
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve({ data: results });
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
        }
    }
    
    getData()
    .then(data => response.json(data))
    .catch(err => console.log(err));
}

// Getting Unit Levels Function
const getLevels = (request, response) => {
    let { curriculumVersion, sectionNumber, unitNumber } = request.params;
    async function getData(){
        try {
            curriculumVersion = parseInt(curriculumVersion, 10);
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM levels WHERE curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? ORDER BY number ASC;";
    
                connection.query(query, [curriculumVersion, sectionNumber, unitNumber], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve({ data: results });
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
        }
    }
    
    getData()
    .then(data => response.json(data))
    .catch(err => console.log(err));
}

// Inserting Level Function
const insertLevel = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber } = request.params;
            const { number, title } = request.body;
        
            async function insertData(){
                try {
                    if (!curriculumVersion || !sectionNumber || !unitNumber || !number || !title) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10);
                        sectionNumber = parseInt(sectionNumber, 10);
                        unitNumber = parseInt(unitNumber, 10);
        
                        const response = await new Promise((resolve, reject) => {
                            const query = "INSERT INTO levels (curriculumVersion, sectionNumber, unitNumber, number, title) VALUES (?,?,?,?,?);";
        
                            connection.query(query, [curriculumVersion, sectionNumber, unitNumber, number, title] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve({ success: true });
                                }
                            })
                        });
                        
                        return response;
                    }
                } catch (error) {
                    console.log(error);
                    return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
                }
            }
            
            insertData()
            .then(data => response.json(data))
            .catch(err => console.log(err));
            
        } else {
            response.json({ error: "لا يمكنك التعديل بعد تحرير المنهج." });
        }

    } else {
        response.redirect('/manage/login');
    }
}

// Updating Level Title Function
const updateLevelTitle = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { levelId } = request.params;
            const { newTitle } = request.body;
        
            async function updateData(){
                try {
                    if (!levelId || !newTitle) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        levelId = parseInt(levelId, 10);
        
                        const response = await new Promise((resolve, reject) => {
                            const query = "UPDATE levels SET title = ? WHERE id = ?";
                
                            connection.query(query, [newTitle, levelId] , (err, result) => {
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
                    return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
                }
            }
            
            updateData()
            .then(data => response.json(data))
            .catch(err => console.log(err));

        } else {
            response.json({ error: "لا يمكنك التعديل بعد تحرير المنهج." });
        }

    } else {
        response.redirect('/manage/login');
    }
}

// Updating Level Order Function
const updateLevelsOrder = async (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber } = request.params;
            const { currentNumbers, newNumbers } = request.body;

            async function updateData(i){
                try {
                    if (!curriculumVersion || !sectionNumber || !unitNumber || !currentNumbers[i] || !newNumbers[i]) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10);
                        sectionNumber = parseInt(sectionNumber, 10);
                        unitNumber = parseInt(unitNumber, 10); 
                        const newPositionDifference = (newNumbers[i] - currentNumbers[i]) * 10;

                        const levelsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE levels SET number = ? WHERE number = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber, unitNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const lessonsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE lessons SET levelNumber = ? WHERE levelNumber = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber, unitNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const contentsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE contents SET levelNumber = ?, position = position + ? WHERE levelNumber = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ?";
                
                            connection.query(query, [newNumbers[i], newPositionDifference, currentNumbers[i], curriculumVersion, sectionNumber, unitNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const response = levelsResponse + lessonsResponse + contentsResponse;
                        return response >= 1 ? { success: true } : { error: "خطأ فى تحديث قاعدة البيانات." };
                    }
                } catch (error) {
                    console.log(error);
                    return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
                }
            }
            
            for(let i = 0; i < currentNumbers.length; i++){
                if (i === currentNumbers.length - 1) {
                    updateData(i)
                    .then(data => response.json(data))
                    .catch(err => console.log(err));
                } else {
                    const updateDataResponse = await updateData(i);
                    if (updateDataResponse.error) {
                        response.json(updateDataResponse);
                        break;
                    }
                }
            }

        } else {
            response.json({ error: "لا يمكنك التعديل بعد تحرير المنهج." });
        }

    } else {
        response.redirect('/manage/login');
    }
}

// Deleting Level Function
const deleteLevel = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber, levelNumber } = request.params;
            async function deleteData(){
                try {
                    if (!curriculumVersion || !sectionNumber || !unitNumber || !levelNumber) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10);
                        sectionNumber = parseInt(sectionNumber, 10); 
                        unitNumber = parseInt(unitNumber, 10); 
                        levelNumber = parseInt(levelNumber, 10); 
        
                        const levelsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM levels WHERE number = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ?";
                
                            connection.query(query, [levelNumber, curriculumVersion, sectionNumber, unitNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const lessonsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM lessons WHERE levelNumber = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ?";
                
                            connection.query(query, [levelNumber, curriculumVersion, sectionNumber, unitNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const contentsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM contents WHERE levelNumber = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ?";
                
                            connection.query(query, [levelNumber, curriculumVersion, sectionNumber, unitNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const response = levelsResponse + lessonsResponse + contentsResponse;
                        return response >= 1 ? { success: true } : { error: "خطأ فى الحذف من قاعدة البيانات." };
                    }
                } catch (error) {
                    console.log(error);
                    return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
                }
            }
            
            deleteData()
            .then(data => response.json(data))
            .catch(err => console.log(err));

        } else {
            response.json({ error: "لا يمكنك التعديل بعد تحرير المنهج." });
        }

    } else {
        response.redirect('/manage/login');
    }
}

// Filling Level Gap Function
const fillLevelsGap = async (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber } = request.params;
            const { currentNumbers, newNumbers } = request.body;
        
            async function updateData(i){
                try {
                    if (!curriculumVersion || !sectionNumber || !unitNumber || !currentNumbers || !newNumbers) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10);
                        sectionNumber = parseInt(sectionNumber, 10);
                        unitNumber = parseInt(unitNumber, 10); 
        
                        const levelsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE levels SET number = ? WHERE number = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber, unitNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const lessonsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE lessons SET levelNumber = ? WHERE levelNumber = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber, unitNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const contentsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE contents SET levelNumber = ?, position = position - 10 WHERE levelNumber = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber, unitNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const response = levelsResponse + lessonsResponse + contentsResponse;
                        return response >= 1 ? { success: true } : { error: "خطأ فى تحديث قاعدة البيانات." };
                    }
                } catch (error) {
                    console.log(error);
                    return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
                }
            }
            
            for (let i = 0; i < currentNumbers.length; i++) {
                if (i === currentNumbers.length - 1) {
                    updateData(i)
                    .then(data => response.json(data))
                    .catch(err => console.log(err));
                } else {
                    const updateDataResponse = await updateData(i);
                    if (updateDataResponse.error) {
                        response.json(updateDataResponse);
                        break;
                    }
                }
            }

        } else {
            response.json({ error: "لا يمكنك التعديل بعد تحرير المنهج." });
        }

    } else {
        response.redirect('/manage/login');
    }
}

// Exporting Functions
module.exports = {
    getAllLevels,
    getLevels,
    insertLevel,
    updateLevelTitle,
    updateLevelsOrder,
    deleteLevel,
    fillLevelsGap,
};