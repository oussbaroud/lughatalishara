// Importing Requirements
const connection = require('../../config/database').connection;

// Getting All Sections Function
const getSections = (request, response) => {
    let { curriculumVersion } = request.params;

    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM sections WHERE curriculumVersion = ? ORDER BY number ASC;";
    
                connection.query(query, [curriculumVersion], (err, results) => {
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
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
        }
    }
    
    getData()
    .then(data => response.json(data))
    .catch(err => console.log(err));
}

// Inserting Section Function
const insertSection = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion } = request.params;
            let { number, title } = request.body;
    
            async function insertData(){
                try {
                    if (!curriculumVersion || !number || !title) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10);
                        number = parseInt(number, 10);
    
                        const response = await new Promise((resolve, reject) => {
                            const query = "INSERT INTO sections (curriculumVersion, number, title) VALUES (?,?,?);";
            
                            connection.query(query, [curriculumVersion, number, title] , (err, result) => {
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

// Updating Section Title Function
const updateSectionTitle = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { sectionId } = request.params;
            const { newTitle } = request.body;
        
            async function updateData(){
                try {
                    if (!sectionId || !newTitle) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        sectionId = parseInt(sectionId, 10); 
                    
                        const response = await new Promise((resolve, reject) => {
                            const query = "UPDATE sections SET title = ? WHERE id = ?";
                
                            connection.query(query, [newTitle, sectionId] , (err, result) => {
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

// Updating Sections Order Function
const updateSectionsOrder = async (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion } = request.params;
            const { currentNumbers, newNumbers } = request.body;

            async function updateData(i){
                try {            
                    if (!curriculumVersion || !currentNumbers[i] || !newNumbers[i]) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10);
                        const newPositionDifference = (newNumbers[i] - currentNumbers[i]) * 1000;
    
                        const sectionsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE sections SET number = ? WHERE number = ? AND curriculumVersion = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const unitsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE units SET sectionNumber = ? WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const testsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE tests SET sectionNumber = ? WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const levelsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE levels SET sectionNumber = ? WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const lessonsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE lessons SET sectionNumber = ? WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const contentsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE contents SET sectionNumber = ?, position = position + ? WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [newNumbers[i], newPositionDifference, currentNumbers[i], curriculumVersion] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
        
                        const response = sectionsResponse + unitsResponse + testsResponse + levelsResponse + lessonsResponse + contentsResponse;
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

// Deleting Section Function
const deleteSection = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion } = request.params;
            let { sectionNumber } = request.params;
    
            async function deleteData(){
                try {
                    if (!curriculumVersion || !sectionNumber) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10); 
                        sectionNumber = parseInt(sectionNumber, 10); 
    
                        const sectionsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM sections WHERE number = ? AND curriculumVersion = ?";
                
                            connection.query(query, [sectionNumber, curriculumVersion], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
                
                        const unitsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM units WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [sectionNumber, curriculumVersion], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const testsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM tests WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [sectionNumber, curriculumVersion], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const levelsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM levels WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [sectionNumber, curriculumVersion], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const lessonsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM lessons WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [sectionNumber, curriculumVersion], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const contentsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM contents WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [sectionNumber, curriculumVersion], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const response = sectionsResponse + unitsResponse + testsResponse + levelsResponse + lessonsResponse + contentsResponse;
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

// Filling Sections Gap Function
const fillSectionsGap = async (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion } = request.params;
            const { currentNumbers, newNumbers } = request.body;
    
            async function updateData(i){
                try {
                    if (!curriculumVersion || !currentNumbers || !newNumbers) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10); 
    
                        const sectionsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE sections SET number = ? WHERE number = ? AND curriculumVersion = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const unitsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE units SET sectionNumber = ? WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const testsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE tests SET sectionNumber = ? WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const levelsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE levels SET sectionNumber = ? WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const lessonsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE lessons SET sectionNumber = ? WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
                        const contentsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE contents SET sectionNumber = ?, position = position - 1000 WHERE sectionNumber = ? AND curriculumVersion = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
        
        
                        const response = sectionsResponse + unitsResponse + testsResponse + levelsResponse + lessonsResponse + contentsResponse;
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
    getSections,
    insertSection,
    updateSectionTitle,
    updateSectionsOrder,
    deleteSection,
    fillSectionsGap,
};