const connection = require('../../dbService').connection;

const getAllSections = (request, response) => {
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM sections ORDER BY number ASC;";
    
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

const insertSection = (request, response) => {
    const { number, title } = request.body;

    async function insertData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO sections (number, title) VALUES (?,?);";

                connection.query(query, [number, title] , (err, result) => {
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

const updateSectionTitle = (request, response) => {
    let { sectionId } = request.params;
    const { newTitle } = request.body;

    async function updateData(){
        try {
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
        } catch (error) {
            console.log(error);
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
        }
    }
    
    updateData()
    .then(data => response.json(data))
    .catch(err => console.log(err));
}

const updateSectionsOrder = async (request, response) => {
    const { ids, newNumbers } = request.body;
    console.log(ids, newNumbers);

    async function updateData(i){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE sections SET number = ? WHERE id = ?";
    
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

const deleteSection = (request, response) => {
    let { sectionNumber } = request.params;
    async function deleteData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10); 

            const sectionsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM sections WHERE number = ?";
    
                connection.query(query, [sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });
    
            const unitsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM units WHERE sectionNumber = ?";
    
                connection.query(query, [sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const testsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM tests WHERE sectionNumber = ?";
    
                connection.query(query, [sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const levelsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM levels WHERE sectionNumber = ?";
    
                connection.query(query, [sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const lessonsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM lessons WHERE sectionNumber = ?";
    
                connection.query(query, [sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const contentsResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM contents WHERE sectionNumber = ?";
    
                connection.query(query, [sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const userJourneyResponse = await new Promise((resolve, reject) => {
                const query = "DELETE FROM userJourney WHERE sectionNumber = ?";
    
                connection.query(query, [sectionNumber], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const response = sectionsResponse + unitsResponse + testsResponse + levelsResponse + lessonsResponse + contentsResponse + userJourneyResponse;
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

const fillSectionsGap = async (request, response) => {
    const { updateThis, currentNumbers, newNumbers } = request.body;

    async function updateData(i){
        try {
            const sectionsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE sections SET number = ? WHERE number = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i]] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const unitsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE units SET sectionNumber = ? WHERE sectionNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i]] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const testsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE tests SET sectionNumber = ? WHERE sectionNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i]] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const levelsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE levels SET sectionNumber = ? WHERE sectionNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i]] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const lessonsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE lessons SET sectionNumber = ? WHERE sectionNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i]] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const contentsResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE contents SET sectionNumber = ?, position = position - 1000 WHERE sectionNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i]] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const userJourneyResponse = await new Promise((resolve, reject) => {
                const query = "UPDATE userJourney SET sectionNumber = ? WHERE sectionNumber = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i]] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });

            const response = sectionsResponse + unitsResponse + testsResponse + levelsResponse + lessonsResponse + contentsResponse + userJourneyResponse;
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
    getAllSections,
    insertSection,
    updateSectionTitle,
    updateSectionsOrder,
    deleteSection,
    fillSectionsGap,
};