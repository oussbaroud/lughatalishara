// Importing Requirements
const connection = require('../../config/database').connection;

// Getting Section Tests Function
const getTests = (request, response) => {
    let { curriculumVersion, sectionNumber } = request.params;
    
    async function getData(){
        try {
            curriculumVersion = parseInt(curriculumVersion, 10);
            sectionNumber = parseInt(sectionNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM tests WHERE curriculumVersion = ? AND sectionNumber = ? ORDER BY unitNumber ASC;";
    
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

// Getting Test Function
const getTest = (request, response) => {
    let { curriculumVersion, sectionNumber, unitNumber } = request.params;

    async function getData(){
        try {
            curriculumVersion = parseInt(curriculumVersion, 10);
            sectionNumber = parseInt(sectionNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM tests WHERE curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ?";
    
                connection.query(query, [curriculumVersion, sectionNumber, unitNumber], (err, results) => {
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

// Inserting Test Function
const insertTest = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber } = request.params;
            let { unitNumber } = request.body;
        
            async function insertData(){
                try {
                    curriculumVersion = parseInt(curriculumVersion, 10);
                    sectionNumber = parseInt(sectionNumber, 10);
                    unitNumber = parseInt(unitNumber, 10);
        
                    const response = await new Promise((resolve, reject) => {
                        const query = "INSERT INTO tests (curriculumVersion, sectionNumber, unitNumber) VALUES (?,?,?);";
        
                        connection.query(query, [curriculumVersion, sectionNumber, unitNumber] , (err, result) => {
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
            
        } else {
            response.json({ error: "لا يمكنك التعديل بعد تحرير المنهج." });
        }

    } else {
        response.redirect('/manage/login');
    }
}

// Deleting Test Function
const deleteTest = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber } = request.params;

            async function deleteData(){
                try {
                    curriculumVersion = parseInt(curriculumVersion, 10);
                    sectionNumber = parseInt(sectionNumber, 10);
                    unitNumber = parseInt(unitNumber, 10);
        
                    const testsResponse = await new Promise((resolve, reject) => {
                        const query = "DELETE FROM tests WHERE curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ?";
            
                        connection.query(query, [curriculumVersion, sectionNumber, unitNumber], (err, result) => {
                            if (err) {
                                reject(new Error(err.message));
                            } else {
                                resolve(result.affectedRows);
                            }
                        })
                    });
        
                    const contentsResponse = await new Promise((resolve, reject) => {
                        const query = "DELETE FROM contents WHERE curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND category = 'test'";
            
                        connection.query(query, [curriculumVersion, sectionNumber, unitNumber], (err, result) => {
                            if (err) {
                                reject(new Error(err.message));
                            } else {
                                resolve(result.affectedRows);
                            }
                        })
                    });
            
                    const response = testsResponse + contentsResponse;
                    return response >= 1 ? { success: true } : { error: "خطأ فى الحذف من قاعدة البيانات." };
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

// Exporting Functions
module.exports = {
    getTests,
    getTest,
    insertTest,
    deleteTest,
};