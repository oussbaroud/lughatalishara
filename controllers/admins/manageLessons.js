// Importing Requirements
const connection = require('../../config/database').connection;

// Getting All Lessons Function
const getAllLessons = (request, response) => {
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM lessons ORDER BY number ASC;";
    
                connection.query(query, (err, results) => {
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

// Getting Level Lessons Function
const getLessons = (request, response) => {
    let { curriculumVersion, sectionNumber, unitNumber, levelNumber } = request.params;
    async function getData(){
        try {
            curriculumVersion = parseInt(curriculumVersion, 10); 
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);
            levelNumber = parseInt(levelNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM lessons WHERE curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber =? ORDER BY number ASC;";
    
                connection.query(query, [curriculumVersion, sectionNumber, unitNumber, levelNumber], (err, results) => {
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

// Inserting Lesson Function
const insertLesson = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber, levelNumber } = request.params;
            const { number, title } = request.body;
        
            async function insertData(){
                try {
                    if (!curriculumVersion || !sectionNumber || !unitNumber || !levelNumber || !number || !title) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10); 
                        sectionNumber = parseInt(sectionNumber, 10);
                        unitNumber = parseInt(unitNumber, 10);
                        levelNumber = parseInt(levelNumber, 10);
        
                        const response = await new Promise((resolve, reject) => {
                            const query = "INSERT INTO lessons (curriculumVersion, sectionNumber, unitNumber, levelNumber, number, title) VALUES (?,?,?,?,?,?);";
        
                            connection.query(query, [curriculumVersion, sectionNumber, unitNumber, levelNumber, number, title] , (err, result) => {
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

// Update Lesson Title Function
const updateLessonTitle = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { lessonId } = request.params;
            const { newTitle } = request.body;
        
            async function updateData(){
                try {
                    if (!lessonId || !newTitle) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        sectionNumber = parseInt(sectionNumber, 10);
                        unitNumber = parseInt(unitNumber, 10);
                        lessonId = parseInt(lessonId, 10);
            
                        const response = await new Promise((resolve, reject) => {
                            const query = "UPDATE lessons SET title = ? WHERE id = ?";
                
                            connection.query(query, [newTitle, lessonId] , (err, result) => {
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

// Updating Lessons Order Function
const updateLessonsOrder = async (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber, levelNumber } = request.params;
            const { currentNumbers, newNumbers } = request.body;

            async function updateData(i){
                try {
                    if (!curriculumVersion || !sectionNumber || !unitNumber || !levelNumber || !currentNumbers[i] || !newNumbers[i]) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10); 
                        sectionNumber = parseInt(sectionNumber, 10);
                        unitNumber = parseInt(unitNumber, 10); 
                        levelNumber = parseInt(levelNumber, 10); 
                        const newPositionDifference = (newNumbers[i] - currentNumbers[i]);

                        const lessonsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE lessons SET number = ? WHERE number = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber, unitNumber, levelNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
            
                        const contentsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE contents SET lessonNumber = ?, position = position - ? WHERE lessonNumber = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ?";
                
                            connection.query(query, [newNumbers[i], newPositionDifference, currentNumbers[i], curriculumVersion, sectionNumber, unitNumber, levelNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
            
                        const response = lessonsResponse + contentsResponse;
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

// Deleting Lesson Function
const deleteLesson = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber } = request.params;

            async function deleteData(){
                try {
                    if (!curriculumVersion || !sectionNumber || !unitNumber || !levelNumber || !lessonNumber) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10); 
                        sectionNumber = parseInt(sectionNumber, 10); 
                        unitNumber = parseInt(unitNumber, 10); 
                        levelNumber = parseInt(levelNumber, 10); 
                        lessonNumber = parseInt(lessonNumber, 10); 
            
                        const lessonsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM lessons WHERE number = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ?";
                
                            connection.query(query, [lessonNumber, curriculumVersion, sectionNumber, unitNumber, levelNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
            
                        const contentsResponse = await new Promise((resolve, reject) => {
                            const query = "DELETE FROM contents WHERE lessonNumber = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ?";
                
                            connection.query(query, [lessonNumber, curriculumVersion, sectionNumber, unitNumber, levelNumber], (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
            
                        const response = lessonsResponse + contentsResponse;
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

// Filling Lessons Gap Function
const fillLessonsGap = async (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber, levelNumber } = request.params;
            const { currentNumbers, newNumbers } = request.body;
        
            async function updateData(i){
                try {
                    if (!curriculumVersion || !sectionNumber || !unitNumber || !levelNumber || !currentNumbers || !newNumbers) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10); 
                        sectionNumber = parseInt(sectionNumber, 10);
                        unitNumber = parseInt(unitNumber, 10); 
                        levelNumber = parseInt(levelNumber, 10); 
            
                        const lessonsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE lessons SET number = ? WHERE number = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber, unitNumber, levelNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
            
                        const contentsResponse = await new Promise((resolve, reject) => {
                            const query = "UPDATE contents SET lessonNumber = ?, position = position - 1 WHERE lessonNumber = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ?";
                
                            connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber, unitNumber, levelNumber] , (err, result) => {
                                if (err) {
                                    reject(new Error(err.message));
                                } else {
                                    resolve(result.affectedRows);
                                }
                            })
                        });
            
                        const response = lessonsResponse + contentsResponse;
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

// Getting Next Lesson Function
const getNextLesson = (request, response) => {
    let { curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber, from } = request.params;

    async function getData(){
        try {
            if (!curriculumVersion || !sectionNumber || !unitNumber || !levelNumber || !lessonNumber || !from) {
                return { error: "يرجى إدخال جميع المعلومات." };
            } else {
                curriculumVersion = parseInt(curriculumVersion, 10); 
                sectionNumber = parseInt(sectionNumber, 10);
                unitNumber = parseInt(unitNumber, 10);
                levelNumber = parseInt(levelNumber, 10);
                lessonNumber = parseInt(lessonNumber, 10);
    
                const response = await new Promise((resolve, reject) => {
                    let query;
                    if (from === 'all') {
                        query = `SELECT * FROM lessons WHERE curriculumVersion = ? AND sectionNumber >= ? AND unitNumber >= ? AND levelNumber >= ? AND number >= ? ORDER BY sectionNumber, unitNumber, levelNumber, number LIMIT 2`;
                    } else {
                        query = `SELECT * FROM lessons WHERE curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ? AND number > ? ORDER BY sectionNumber, unitNumber, levelNumber, number LIMIT 1`;
                    }
                    console.log(curriculumVersion)
                    connection.query(query, [curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber], (err, results) => {
                        if (err) reject(new Error(err.message));
                        resolve({ data: results });
                    })
                });
    
                return response;
            }
        } catch (error) {
            console.log(error);
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
        }
    }
    
    getData()
    .then(data => response.json(data))
    .catch(err => console.log(err));
}

// Exporting Functions
module.exports = {
    getAllLessons,
    getLessons,
    getNextLesson,
    insertLesson,
    updateLessonTitle,
    updateLessonsOrder,
    deleteLesson,
    fillLessonsGap,
};