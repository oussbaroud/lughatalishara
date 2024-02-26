const connection = require('../../dbService').connection;

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
const getUnits = (request, response) => {
    let { sectionNumber } = request.params;
    async function getData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM units WHERE sectionNumber = ? ORDER BY number ASC;";
    
                connection.query(query, [sectionNumber], (err, results) => {
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

const insertUnit = (request, response) => {
    let { sectionNumber } = request.params;
    const { number, title } = request.body;

    async function insertData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO units (sectionNumber, number, title) VALUES (?,?,?);";

                connection.query(query, [sectionNumber, number, title] , (err, result) => {
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

const updateUnitTitle = (request, response) => {
    let { sectionNumber, unitId } = request.params;
    const { newTitle } = request.body;

    async function updateData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitId = parseInt(unitId, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE units SET title = ? WHERE id = ? AND sectionNumber = ?";
    
                connection.query(query, [newTitle, unitId, sectionNumber] , (err, result) => {
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

const updateUnitsOrder = async (request, response) => {
    let { sectionNumber } = request.params;
    const { ids, newNumbers } = request.body;
    console.log(ids, newNumbers);

    async function updateData(i){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE units SET number = ? WHERE id = ? AND sectionNumber = ?";
    
                connection.query(query, [newNumbers[i], ids[i], sectionNumber] , (err, result) => {
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

const deleteUnit = (request, response) => {
    let { sectionNumber, unitNumber } = request.params;
    async function deleteData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);
    
            const unitsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM units WHERE number = ? AND sectionNumber = ?";
    
                connection.query(query, [unitNumber, sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const testsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM tests WHERE unitNumber = ? AND sectionNumber = ?";
    
                connection.query(query, [unitNumber, sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const levelsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM levels WHERE unitNumber = ? AND sectionNumber = ?";
    
                connection.query(query, [unitNumber, sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const lessonsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM lessons WHERE unitNumber = ? AND sectionNumber = ?";
    
                connection.query(query, [unitNumber, sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const contentsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM contents WHERE unitNumber = ? AND sectionNumber = ?";
    
                connection.query(query, [unitNumber, sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const userJourneyResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM userJourney WHERE unitNumber = ? AND sectionNumber = ?";
    
                connection.query(query, [unitNumber, sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const response = unitsResponse + testsResponse + levelsResponse + lessonsResponse + contentsResponse + userJourneyResponse;
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

const fillUnitsGap = async (request, response) => {
    let { sectionNumber } = request.params;
    const { currentNumbers, newNumbers } = request.body;
    console.log(currentNumbers, newNumbers);

    async function updateData(i){
        try {
            sectionNumber = parseInt(sectionNumber, 10); 

            const unitsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE units SET number = ? WHERE number = ? AND sectionNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const testsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE tests SET unitNumber = ? WHERE unitNumber = ? AND sectionNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const levelsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE levels SET unitNumber = ? WHERE unitNumber = ? AND sectionNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const lessonsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE lessons SET unitNumber = ? WHERE unitNumber = ? AND sectionNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const contentsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE contents SET unitNumber = ?, position = position - 100 WHERE unitNumber = ? AND sectionNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });
            
            const userJourneyResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE userJourney SET unitNumber = ? WHERE unitNumber = ? AND sectionNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const response = unitsResponse + testsResponse + levelsResponse + lessonsResponse + contentsResponse + userJourneyResponse;
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

module.exports = {
    getAllUnits,
    getUnits,
    insertUnit,
    updateUnitTitle,
    updateUnitsOrder,
    deleteUnit,
    fillUnitsGap,
};