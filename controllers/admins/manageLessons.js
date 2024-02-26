const connection = require('../../dbService').connection;

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
const getLessons = (request, response) => {
    let { sectionNumber, unitNumber, levelNumber } = request.params;
    async function getData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);
            levelNumber = parseInt(levelNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM lessons WHERE sectionNumber = ? AND unitNumber = ? AND levelNumber =? ORDER BY number ASC;";
    
                connection.query(query, [sectionNumber, unitNumber, levelNumber], (err, results) => {
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

const insertLesson = (request, response) => {
    let { sectionNumber, unitNumber, levelNumber } = request.params;
    const { number, title } = request.body;

    async function insertData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);
            levelNumber = parseInt(levelNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO lessons (sectionNumber, unitNumber, levelNumber, number, title) VALUES (?,?,?,?,?);";

                connection.query(query, [sectionNumber, unitNumber, levelNumber, number, title] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve({ success: true });
                    }
                })
            });
            return response;
        } catch (error) {
            console.log(error);
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
        }
    }
    
    insertData()
    .then(data => response.json(data))
    .catch(err => console.log(err));
}

const updateLessonTitle = (request, response) => {
    let { sectionNumber, unitNumber, lessonId } = request.params;
    const { newTitle } = request.body;

    async function updateData(){
        try {
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
        } catch (error) {
            console.log(error);
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
        }
    }
    
    updateData()
    .then(data => response.json(data))
    .catch(err => console.log(err));
}

const updateLessonsOrder = async (request, response) => {
    let { sectionNumber, unitNumber } = request.params;
    const { ids, newNumbers } = request.body;
    console.log(ids, newNumbers);

    async function updateData(i){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE lessons SET number = ? WHERE id = ?";
    
                connection.query(query, [newNumbers[i], ids[i]] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });
    
            return response === 1 ? { success: true } : { error: "خطأ فى تحديث قاعدة البيانات." };
        } catch (error) {
            console.log(error);
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
        }
    }
    
    for(let i = 0; i < ids.length; i++){
        if(i === ids.length - 1){
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

const deleteLesson = (request, response) => {
    let { sectionNumber, unitNumber, levelNumber, lessonNumber } = request.params;
    async function deleteData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10); 
            unitNumber = parseInt(unitNumber, 10); 
            levelNumber = parseInt(levelNumber, 10); 
            lessonNumber = parseInt(lessonNumber, 10); 

            const lessonsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM lessons WHERE number = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ?";
    
                connection.query(query, [lessonNumber, sectionNumber, unitNumber, levelNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const contentsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM contents WHERE lessonNumber = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ?";
    
                connection.query(query, [lessonNumber, sectionNumber, unitNumber, levelNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const userJourneyResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE userJourney SET lessonNumber = lessonNumber - 1 WHERE levelNumber = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ?";
    
                connection.query(query, [lessonNumber, sectionNumber, unitNumber, levelNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const response = lessonsResponse + contentsResponse + userJourneyResponse;
            return response >= 1 ? { success: true } : { error: "خطأ فى الحذف من قاعدة البيانات." };
        } catch (error) {
            console.log(error);
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
        }
    }
    
    deleteData()
    .then(data => response.json(data))
    .catch(err => console.log(err));
}

const fillLessonsGap = async (request, response) => {
    let { sectionNumber, unitNumber, levelNumber } = request.params;
    const { currentNumbers, newNumbers } = request.body;
    console.log(currentNumbers, newNumbers);

    async function updateData(i){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10); 
            levelNumber = parseInt(levelNumber, 10); 

            const lessonsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE lessons SET number = ? WHERE number = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber, unitNumber, levelNumber] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const contentsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE contents SET lessonNumber = ?, position = position - 1 WHERE lessonNumber = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber, unitNumber, levelNumber] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });
            
            const userJourneyResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE userJourney SET unitNumber = ? WHERE unitNumber = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber, unitNumber, levelNumber] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const response = lessonsResponse + contentsResponse + userJourneyResponse;
            return response >= 1 ? { success: true } : { error: "خطأ فى تحديث قاعدة البيانات." };
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
}

const getNextLesson = (request, response) => {
    let { sectionNumber, unitNumber, levelNumber, lessonNumber, from } = request.params;
    async function getData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);
            levelNumber = parseInt(levelNumber, 10);
            lessonNumber = parseInt(lessonNumber, 10);

            console.log('', sectionNumber, unitNumber, levelNumber, lessonNumber, from)
            const response = await new Promise((resolve, reject) => {
                let query;
                if (from === 'all') {
                    query = `SELECT * FROM lessons WHERE sectionNumber >= ? AND unitNumber >= ? AND levelNumber >= ? AND number >= ? ORDER BY sectionNumber, unitNumber, levelNumber, number LIMIT 2`;
                } else {
                    query = `SELECT * FROM lessons WHERE sectionNumber = ? AND unitNumber = ? AND levelNumber = ? AND number < ? ORDER BY sectionNumber, unitNumber, levelNumber, number LIMIT 1`;
                }
    
                connection.query(query, [sectionNumber, unitNumber, levelNumber, lessonNumber], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve({ data: results });
                })
            });
            //console.log(response);
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