const connection = require('../../dbService').connection;

const getAllContents = (request, response) => {
    let { content, position } = request.params;
    async function getData(){
        try {
            console.log(content);
            position = parseInt(position, 10);
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM contents WHERE category = 'course' AND content LIKE ? AND position < ?`;
    
                connection.query(query, ['%' + content + '%', position], (err, results) => {
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
const getContents = (request, response) => {
    let { sectionNumber, unitNumber, levelNumber, lessonNumber } = request.params;
    async function getData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);
            levelNumber = parseInt(levelNumber, 10);
            lessonNumber = parseInt(lessonNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM contents WHERE sectionNumber = ? AND unitNumber = ? AND levelNumber =? AND lessonNumber = ? ORDER BY number ASC;";
    
                connection.query(query, [sectionNumber, unitNumber, levelNumber, lessonNumber], (err, results) => {
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

const insertContent = (request, response) => {
    let { sectionNumber, unitNumber, levelNumber, lessonNumber } = request.params;
    const { number, category, type, content } = request.body;

    async function insertData(){
        try {
            let position = "" + sectionNumber + unitNumber + levelNumber + lessonNumber;

            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);
            levelNumber = parseInt(levelNumber, 10);
            lessonNumber = parseInt(lessonNumber, 10);
            position = parseInt(position, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO contents (sectionNumber, unitNumber, levelNumber, lessonNumber, position, number, category, type, content) VALUES (?,?,?,?,?,?,?,?,?);";

                connection.query(query, [sectionNumber, unitNumber, levelNumber, lessonNumber, position, number, category, type, content] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve({ success: true });
                    }
                })
            });
            return responses;
        } catch (error) {
            console.log(error);
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
        }
    }
    
    insertData()
    .then(data => response.json(data))
    .catch(err => console.log(err));
}

const updateContent = (request, response) => {
    let { sectionNumber, unitNumber, contentId } = request.params;
    const { newContent, newType } = request.body;

    async function updateData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);
            contentId = parseInt(contentId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE contents SET content = ?, type = ? WHERE id = ?";
    
                connection.query(query, [newContent, newType, contentId] , (err, result) => {
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

const updateContentsOrder = async (request, response) => {
    let { sectionNumber, unitNumber } = request.params;
    const { ids, newNumbers } = request.body;
    console.log(ids, newNumbers);

    async function updateData(i){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE contents SET number = ? WHERE id = ?";
    
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

const deleteContent = (request, response) => {
    let { contentId } = request.params;
    async function deleteData(){
        try {
            contentId = parseInt(contentId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM contents WHERE id = ?";
    
                connection.query(query, [contentId] , (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                })
            });
    
            return response === 1 ? { success: true } : { error: "خطأ فى الحذف من قاعدة البيانات." };
        } catch (error) {
            console.log(error);
            return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
        }
    }
    
    deleteData()
    .then(data => response.json(data))
    .catch(err => console.log(err));
}

const fillContentsGap = async (request, response) => {
    let { sectionNumber, unitNumber, levelNumber, lessonNumber } = request.params;
    const { currentNumbers, newNumbers } = request.body;
    console.log(currentNumbers, newNumbers);

    async function updateData(i){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10); 
            levelNumber = parseInt(levelNumber, 10);
            lessonNumber = parseInt(lessonNumber, 10); 

            let response;
            if (request.originalUrl.includes('course')) {
                console.log('uncludes course ' + request.originalUrl);
                response = await new Promise((resolve, reject) => {
                    const query = "UPDATE contents SET number = ? WHERE number = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ? AND lessonNumber = ? AND category = 'course'";
        
                    connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber, unitNumber, levelNumber, lessonNumber] , (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    })
                });
            } else {
                console.log('uncludes tests ' + request.originalUrl);
                response = await new Promise((resolve, reject) => {
                    const query = "UPDATE contents SET number = ? WHERE number = ? AND sectionNumber = ? AND unitNumber = ? AND category = 'test'";
        
                    connection.query(query, [newNumbers[i], currentNumbers[i], sectionNumber, unitNumber] , (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    })
                });
            }
    
            return response === 1 ? { success: true } : { error: "خطأ فى تحديث قاعدة البيانات." };
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

const getTestContent = (request, response) => {
    let { sectionNumber, unitNumber } = request.params;
    async function getData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM contents WHERE sectionNumber = ? AND unitNumber = ? AND category = 'test' ORDER BY number ASC;";
    
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

const insertTestContent = (request, response) => {
    let { sectionNumber, unitNumber } = request.params;
    const { number, type, category, content } = request.body;

    async function insertData(){
        try {
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO contents (sectionNumber, unitNumber, number, type, category, content) VALUES (?,?,?,?,?,?)";

                connection.query(query, [sectionNumber, unitNumber, number, type, category, content] , (err, result) => {
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

module.exports = {
    getAllContents,
    getContents,
    insertContent,
    updateContent,
    updateContentsOrder,
    deleteContent,
    fillContentsGap,
    getTestContent,
    insertTestContent
};