// Importing Requirements
const connection = require('../../config/database').connection;

// Getting User Journey Function
const getUserJourney = (request, response) => {
    let { category, userId } = request.params;
    async function getData(){
        try {
            userId = parseInt(userId, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM userJourney WHERE category = ? AND userId = ? ORDER BY sectionNumber, unitNumber, levelNumber, lessonNumber";
    
                connection.query(query, [category, userId], (err, results) => {
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

// Deletting Prevous User Journey Unit Check Point Function
const deletePreviousCheckPoint = (request, response) => {
    let { category, userId, sectionNumber, unitNumber } = request.params;
    async function deleteData(){
        try {
            userId = parseInt(userId, 10);
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM userJourney WHERE category = ? AND userId = ? AND sectionNumber = ? AND unitNumber = ?";
    
                connection.query(query, [category, userId, sectionNumber, unitNumber] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });
    
            return response >= 0 ? { success: true } : { error: "خطأ فى الحذف من قاعدة البيانات." };
        } catch (error) {
            console.log(error);
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
        }
    }
    
    deleteData()
    .then(data => response.json(data))
    .catch(err => console.log(err));
}

// Inserting User Journey Unit Check Point
const insertCheckPoint = (request, response) => {
    let { category, userId } = request.params;
    let { curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber, checkPoint } = request.body;

    async function insertData(){
        try {
            userId = parseInt(userId, 10);
            curriculumVersion = parseInt(curriculumVersion, 10);
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);
            levelNumber = parseInt(levelNumber, 10);
            lessonNumber = parseInt(lessonNumber, 10);
            checkPoint = parseInt(checkPoint, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO userJourney (userId, category, curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber, checkpoint) VALUES (?,?,?,?,?,?,?,?);";

                connection.query(query, [userId, category, curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber, checkPoint], (err, result) => {
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

// Exporting Functions
module.exports = { 
    getUserJourney,
    deletePreviousCheckPoint,
    insertCheckPoint 
};