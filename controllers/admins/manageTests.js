const connection = require('../../dbService').connection;

const getTests = (request, response) => {
    let { sectionNumber } = request.params;
    async function getData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM tests WHERE sectionNumber = ? ORDER BY unitNumber ASC;";
    
                connection.query(query, [sectionNumber], (err, results) => {
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

const insertTest = (request, response) => {
    let { sectionNumber } = request.params;
    let { unitNumber } = request.body;

    async function insertData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO tests (sectionNumber, unitNumber) VALUES (?,?);";

                connection.query(query, [sectionNumber, unitNumber] , (err, result) => {
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

const deleteTest = (request, response) => {
    let { sectionNumber, unitNumber } = request.params;
    async function deleteData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);

            const testsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM tests WHERE sectionNumber = ? AND unitNumber = ?";
    
                connection.query(query, [sectionNumber, unitNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const contentsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM contents WHERE unitNumber = ? AND sectionNumber = ? AND category = 'test'";
    
                connection.query(query, [unitNumber, sectionNumber], (err, result) => {
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
}

module.exports = {
    getTests,
    insertTest,
    deleteTest,
};