// Importing Requirements
const connection = require('../../config/database').connection;

// Getting All Curriculums Function
const getAllCurriculums = (request, response) => {
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM curriculums ORDER BY version ASC;";
    
                connection.query(query, (err, results) => {
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

// Getting Curriculum
const getCurriculum = (request, response) => {
    const { releaseDate } = request.params;

    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM curriculums WHERE released = 'true' AND releaseDate <= ? ORDER BY version ASC LIMIT 1;";
    
                connection.query(query, [releaseDate], (err, results) => {
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

// Getting Curriculum Released Function
const getCurriculumReleased = (request, response, next) => {
    let { curriculumVersion } = request.params;

    try {
        curriculumVersion = parseInt(curriculumVersion, 10); 

        const query = "SELECT released FROM curriculums WHERE version = ? ORDER BY version ASC;";
        connection.query(query, [curriculumVersion], (err, res) => {
            if (err) {
                new Error(err.message);
            } else {
                if (!res[0]) {
                    return next();
                } else {
                    request.released = res[0].released;
                    if (request.originalUrl.includes('getReleased')) {
                        response.json({ released: request.released })
                    }
                    return next();
                }
            }
        })

    } catch (error) {
        console.log(error);
        response.json({ error: "خطأ فى إنشاء اتصال بقاعدة البيانات." });
        return next();
    }
}

// Inserting Curriculum Function
const insertCurriculum = (request, response) => {
    if (request.user && request.content) {
        const { title, released } = request.body;

        async function insertData(){
            try {
                if (!title || !released) {
                    return { error: "يرجى إدخال جميع المعلومات." };
                } else {
                    const response = await new Promise((resolve, reject) => {
                        const query = "INSERT INTO curriculums (title, released) VALUES (?,?);";
        
                        connection.query(query, [title, released], (err, result) => {
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
                return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." };
            }
        }
        
        insertData()
        .then(data => response.json(data))
        .catch(err => console.log(err));

    } else {
        response.redirect('/manage/login');
    }
}

// Updating Curriculum Title Function
const updateCurriculumTitle = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion } = request.params;
            const { newTitle } = request.body;
        
            async function updateData(){
                try {
                    if (!curriculumVersion || !newTitle) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10); 
                    
                        const response = await new Promise((resolve, reject) => {
                            const query = "UPDATE curriculums SET title = ? WHERE version = ?";
                
                            connection.query(query, [newTitle, curriculumVersion], (err, result) => {
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

// Updating Curriculum Released Function
const updateCurriculumReleased = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion } = request.params;
            const { released } = request.body;
        
            async function updateData(){
                try {
                    if (!curriculumVersion || !released) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10); 
                    
                        const response = await new Promise((resolve, reject) => {
                            const query = "UPDATE curriculums SET released = ? WHERE version = ?";
                
                            connection.query(query, [released, curriculumVersion], (err, result) => {
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


    if (request.released === 'false') {

    } else {
        response.json({ error: "لا يمكنك التعديل بعد تحرير المنهج." });
    }
}

// Exporting Functions
module.exports = {
    getAllCurriculums,
    getCurriculum,
    insertCurriculum,
    updateCurriculumTitle,
    updateCurriculumReleased,
    getCurriculumReleased
};