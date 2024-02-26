const connection = require('../../dbService').connection;

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
const getLevels = (request, response) => {
    let { sectionNumber, unitNumber } = request.params;
    async function getData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM levels WHERE sectionNumber = ? AND unitNumber = ? ORDER BY number ASC;";
    
                connection.query(query, [sectionNumber, unitNumber], (err, results) => {
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

const insertLevel = (request, response) => {
    let { sectionNumber, unitNumber } = request.params;
    const { number, title } = request.body;

    async function insertData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO levels (sectionNumber, unitNumber, number, title) VALUES (?,?,?,?);";

                connection.query(query, [sectionNumber, unitNumber, number, title] , (err, result) => {
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

const updateLevelTitle = (request, response) => {
    let { sectionNumber, unitNumber, levelId } = request.params;
    const { newTitle } = request.body;

    async function updateData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);
            levelId = parseInt(levelId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE levels SET title = ? WHERE id = ? AND sectionNumber = ? AND unitNumber = ?";
    
                connection.query(query, [newTitle, levelId, sectionNumber, unitNumber] , (err, result) => {
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

const updateLevelsOrder = async (request, response) => {
    let { sectionNumber, unitNumber } = request.params;
    const { ids, newNumbers } = request.body;
    console.log(ids, newNumbers);

    async function updateData(i){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE levels SET number = ? WHERE id = ? AND sectionNumber = ? AND unitNumber = ?";
    
                connection.query(query, [newNumbers[i], ids[i], sectionNumber, unitNumber] , (err, result) => {
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

const deleteLevel = (request, response) => {
    let { sectionNumber, unitNumber, levelNumber } = request.params;
    async function deleteData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10); 
            unitNumber = parseInt(unitNumber, 10); 
            levelNumber = parseInt(levelNumber, 10); 

            const levelsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM levels WHERE number = ? AND sectionNumber = ? AND unitNumber = ?";
    
                connection.query(query, [levelNumber, sectionNumber, unitNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const lessonsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM lessons WHERE levelNumber = ? AND sectionNumber = ? AND unitNumber = ?";
    
                connection.query(query, [levelNumber, sectionNumber, unitNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const contentsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM contents WHERE levelNumber = ? AND sectionNumber = ? AND unitNumber = ?";
    
                connection.query(query, [levelNumber, sectionNumber, unitNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const userJourneyResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE userJourney SET levelNumber = levelNumber - 1 WHERE levelNumber = ? AND sectionNumber = ? AND unitNumber = ?";
    
                connection.query(query, [levelNumber, sectionNumber, unitNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const response = levelsResponse + lessonsResponse + contentsResponse + userJourneyResponse;
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

const fillLevelsGap = async (request, response) => {
    let { sectionNumber, unitNumber } = request.params;
    const { currentNumbers, newNumbers } = request.body;
    console.log(currentNumbers, newNumbers);

    async function updateData(i){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10); 

            const levelsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE levels SET number = ? WHERE number = ? AND sectionNumber = ? AND unitNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber, unitNumber] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const lessonsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE lessons SET levelNumber = ? WHERE levelNumber = ? AND sectionNumber = ? AND unitNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber, unitNumber] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const contentsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE contents SET levelNumber = ?, position = position - 10 WHERE levelNumber = ? AND sectionNumber = ? AND unitNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber, unitNumber] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });
            
            const userJourneyResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE userJourney SET unitNumber = ? WHERE unitNumber = ? AND sectionNumber = ? AND unitNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber, unitNumber] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const response = levelsResponse + lessonsResponse + contentsResponse + userJourneyResponse;
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
    getAllLevels,
    getLevels,
    insertLevel,
    updateLevelTitle,
    updateLevelsOrder,
    deleteLevel,
    fillLevelsGap,
};