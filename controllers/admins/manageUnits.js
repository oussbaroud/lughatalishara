// Importing Requirements
const connection = require('../../config/database').connection;

// Getting All Units Function
const getAllUnits = (request, response) => {
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM units ORDER BY number ASC;";
    
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

// Getting Section Units Function
const getUnits = (request, response) => {
    let { curriculumVersion, sectionNumber } = request.params;

    async function getData(){
        try {
            curriculumVersion = parseInt(curriculumVersion, 10); 
            sectionNumber = parseInt(sectionNumber, 10); 

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM units WHERE curriculumVersion = ? AND sectionNumber = ? ORDER BY number ASC;";
    
                connection.query(query, [curriculumVersion, sectionNumber], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve({ data: results });
                })
            });

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

// Inserting Unit Function
const insertUnit = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber } = request.params;
            let { number, title } = request.body;
        
            async function insertData(){
                try {
                    if (!curriculumVersion || !sectionNumber || !number || !title) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10);
                        sectionNumber = parseInt(sectionNumber, 10);
                        number = parseInt(number, 10);
        
                        const response = await new Promise((resolve, reject) => {
                            const query = "INSERT INTO units (curriculumVersion, sectionNumber, number, title) VALUES (?,?,?,?);";
        
                            connection.query(query, [curriculumVersion, sectionNumber, number, title] , (err, result) => {
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

// Updating Unit Title Function
const updateUnitTitle = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { unitId } = request.params;
            const { newTitle } = request.body;
        
            async function updateData(){
                try {
                    if (!unitId || !newTitle) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        unitId = parseInt(unitId, 10); 
        
                        const response = await new Promise((resolve, reject) => {
                            const query = "UPDATE units SET title = ? WHERE id = ?";
                
                            connection.query(query, [newTitle, unitId], (err, result) => {
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

// Updating Units Order Function
const updateUnitsOrder = async (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber } = request.params;
            const { currentNumbers, newNumbers } = request.body;
    
            async function updateData(i){
                try {
                    if (!curriculumVersion || !sectionNumber || !currentNumbers[i] || !newNumbers[i]) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10); 
                        sectionNumber = parseInt(sectionNumber, 10); 
                        const newPositionDifference = (newNumbers[i] - currentNumbers[i]) * 100;

                        const unitsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE units SET number = ? WHERE number = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const testsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE tests SET unitNumber = ? WHERE unitNumber = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const levelsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE levels SET unitNumber = ? WHERE unitNumber = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const lessonsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE lessons SET unitNumber = ? WHERE unitNumber = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const contentsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE contents SET unitNumber = ?, position = position + ? WHERE unitNumber = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [newNumbers[i], newPositionDifference, currentNumbers[i], curriculumVersion, sectionNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const response = unitsResponse + testsResponse + levelsResponse + lessonsResponse + contentsResponse;
                        return response >= 1 ? { success: true } : { error: "خطأ فى تحديث قاعدة البيانات." };
                    }
                } catch (error) {
                    console.log(error);
                    return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
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

        } else {
            response.json({ error: "لا يمكنك التعديل بعد تحرير المنهج." });
        }

    } else {
        response.redirect('/manage/login');
    }
}

// Deleting Unit Function
const deleteUnit = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber } = request.params;

            async function deleteData(){
                try {
                    if (!curriculumVersion || !sectionNumber || !unitNumber) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10);
                        sectionNumber = parseInt(sectionNumber, 10);
                        unitNumber = parseInt(unitNumber, 10);
                
                        const unitsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM units WHERE number = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [unitNumber, curriculumVersion, sectionNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const testsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM tests WHERE unitNumber = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [unitNumber, curriculumVersion, sectionNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const levelsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM levels WHERE unitNumber = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [unitNumber, curriculumVersion, sectionNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const lessonsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM lessons WHERE unitNumber = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [unitNumber, curriculumVersion, sectionNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const contentsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM contents WHERE unitNumber = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [unitNumber, curriculumVersion, sectionNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const response = unitsResponse + testsResponse + levelsResponse + lessonsResponse + contentsResponse;
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

// Filling Units Gap Function
const fillUnitsGap = async (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber } = request.params;
            const { currentNumbers, newNumbers } = request.body;
        
            async function updateData(i){
                try {
                    if (!curriculumVersion || !sectionNumber || !currentNumbers || !newNumbers) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10); 
                        sectionNumber = parseInt(sectionNumber, 10); 
        
                        const unitsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE units SET number = ? WHERE number = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const testsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE tests SET unitNumber = ? WHERE unitNumber = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const levelsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE levels SET unitNumber = ? WHERE unitNumber = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const lessonsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE lessons SET unitNumber = ? WHERE unitNumber = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const contentsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE contents SET unitNumber = ?, position = position - 100 WHERE unitNumber = ? AND curriculumVersion = ? AND sectionNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const response = unitsResponse + testsResponse + levelsResponse + lessonsResponse + contentsResponse;
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
    getAllUnits,
    getUnits,
    insertUnit,
    updateUnitTitle,
    updateUnitsOrder,
    deleteUnit,
    fillUnitsGap,
};