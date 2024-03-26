// Importing Requirements
const connection = require('../../config/database').connection;

// Getting Same Previous Course Content Function
const getAllContents = (request, response) => {
    let { curriculumVersion, content, position } = request.params;
    async function getData(){
        try {
            curriculumVersion = parseInt(curriculumVersion, 10);
            position = parseInt(position, 10);

            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM contents WHERE curriculumVersion = ? AND category = 'course' AND content LIKE ? AND position < ?`;
    
                connection.query(query, [curriculumVersion, '%' + content + '%', position], (err, results) => {
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

// Getting Lesson Content Function
const getContents = (request, response) => {
    let { curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber } = request.params;
    async function getData(){
        try {
            curriculumVersion = parseInt(curriculumVersion, 10);
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);
            levelNumber = parseInt(levelNumber, 10);
            lessonNumber = parseInt(lessonNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM contents WHERE curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber =? AND lessonNumber = ? ORDER BY number ASC;";
    
                connection.query(query, [curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber], (err, results) => {
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

// Inserting Lesson Content Function
const insertContent = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber } = request.params;
            const { number, category, type, content } = request.body;
        
            async function insertData(){
                try {
                    if (!curriculumVersion || !sectionNumber || !unitNumber || !levelNumber || !lessonNumber || !number || !category || !type || !content) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        // Declaring Content Available
                        let contentAvailable = true;

                        // If Multiple Content
                        if (content.includes('&')) {
                            // Assgning Separated Content
                            const separatedContent = content.split('&');

                            // For Every Separated Content
                            for (let index = 0; index < separatedContent.length; index++) {
                                // Declaring Content Constant
                                const eachSeparatedContent = separatedContent[index];

                                // If Letter
                                if (eachSeparatedContent.length === 1) {
                                    // Selecting Letter
                                    const response = await new Promise((resolve, reject) => {
                                        const query = "SELECT * FROM letters WHERE letter = ?";
                            
                                        connection.query(query, [eachSeparatedContent], (err, results) => {
                                            if (err) {
                                                reject(new Error(err.message));
                                            } else {
                                                resolve(results);
                                            }
                                        })
                                    });

                                    // If Letter Not Available
                                    if (!response[0]) {
                                        contentAvailable = false;
                                    }

                                // If Word
                                } else {
                                    // Selecting Word
                                    const response = await new Promise((resolve, reject) => {
                                        const query = "SELECT * FROM dictionary WHERE word = ?";
                            
                                        connection.query(query, [eachSeparatedContent], (err, results) => {
                                            if (err) {
                                                reject(new Error(err.message));
                                            } else {
                                                resolve(results);
                                            }
                                        })
                                    });

                                    // If Word Not Available
                                    if (!response[0]) {
                                        contentAvailable = false;
                                    }
                                }
                            }

                        // If Single Content
                        } else {
                            // If Letter
                            if (content.length === 1) {
                                // Selecting Letter
                                const response = await new Promise((resolve, reject) => {
                                    const query = "SELECT * FROM letters WHERE letter = ?";
                        
                                    connection.query(query, [content], (err, results) => {
                                        if (err) {
                                            reject(new Error(err.message));
                                        } else {
                                            resolve(results);
                                        }
                                    })
                                });

                                // If Letter Not Available
                                if (!response[0]) {
                                    contentAvailable = false;
                                }

                            // If Word
                            } else {
                                // Selecting Word
                                const response = await new Promise((resolve, reject) => {
                                    const query = "SELECT * FROM dictionary WHERE word = ?";
                        
                                    connection.query(query, [content], (err, results) => {
                                        if (err) {
                                            reject(new Error(err.message));
                                        } else {
                                            resolve(results);
                                        }
                                    })
                                });

                                // If Word Not Available
                                if (!response[0]) {
                                    contentAvailable = false;
                                }
                            }
                        }

                        if (contentAvailable) {
                            curriculumVersion = parseInt(curriculumVersion, 10);
                            sectionNumber = parseInt(sectionNumber, 10);
                            unitNumber = parseInt(unitNumber, 10);
                            levelNumber = parseInt(levelNumber, 10);
                            lessonNumber = parseInt(lessonNumber, 10);
    
                            let position = "" + sectionNumber + unitNumber + levelNumber + lessonNumber;
                            position = parseInt(position, 10);
            
                            const response = await new Promise((resolve, reject) => {
                                const query = "INSERT INTO contents (curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber, position, number, category, type, content) VALUES (?,?,?,?,?,?,?,?,?,?);";
            
                                connection.query(query, [curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber, position, number, category, type, content] , (err, result) => {
                                    if (err) {
                                        reject(new Error(err.message));
                                    } else {
                                        resolve({ success: true });
                                    }
                                })
                            });
                            
                            return response;
                        } else {
                            return { error: "هذا المحتوى غير متوفر." };
                        }
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
            response.json({ error: "لا يمكنك التعديل بعد تحرير المنهج." });
        }

    } else {
        response.redirect('/manage/login');
    }
}

// Updating Content Function
const updateContent = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { contentId } = request.params;
            const { newContent, newType } = request.body;
        
            async function updateData(){
                try {
                    if (!contentId || !newContent || !newType) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
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

// Updating Content Order Function
const updateContentsOrder = async (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber } = request.params;
            const { currentNumbers, newNumbers } = request.body;
        
            async function updateData(i){
                try {
                    if (!curriculumVersion || !sectionNumber || !unitNumber || !levelNumber || !lessonNumber || !currentNumbers || !newNumbers) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10);
                        sectionNumber = parseInt(sectionNumber, 10);
                        unitNumber = parseInt(unitNumber, 10); 
                        levelNumber = parseInt(levelNumber, 10);
                        lessonNumber = parseInt(lessonNumber, 10); 
        
                        let response;
                        if (request.originalUrl.includes('course')) {
                            response = await new Promise((resolve, reject) => {
                                const query = "UPDATE contents SET number = ? WHERE number = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ? AND lessonNumber = ? AND category = 'course'";
                    
                                connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber] , (err, result) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(result.affectedRows);
                                })
                            });
                        } else {
                            response = await new Promise((resolve, reject) => {
                                const query = "UPDATE contents SET number = ? WHERE number = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND category = 'test'";
                    
                                connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber, unitNumber] , (err, result) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(result.affectedRows);
                                })
                            });
                        }
                
                        return response === 1 ? { success: true } : { error: "خطأ فى تحديث قاعدة البيانات." };
                    }
                } catch (error) {
                    console.log(error);
                    return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
                }
            }
            
            for (let i = 0; i < currentNumbers.length; i++) {
                if (i === currentNumbers.length - 1) {
                    updateData(i)
                    .then(data => response.json(data))
                    .catch(err => console.log(err));
                } else {
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

// Deleting Content Function
const deleteContent = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { contentId } = request.params;
            async function deleteData(){
                try {
                    if (!contentId) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
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

// Filling Content Gap Function
const fillContentsGap = async (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber } = request.params;
            const { currentNumbers, newNumbers } = request.body;
        
            async function updateData(i){
                try {
                    if (!curriculumVersion || !sectionNumber || !unitNumber || !levelNumber || !lessonNumber || !currentNumbers || !newNumbers) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        curriculumVersion = parseInt(curriculumVersion, 10);
                        sectionNumber = parseInt(sectionNumber, 10);
                        unitNumber = parseInt(unitNumber, 10); 
                        levelNumber = parseInt(levelNumber, 10);
                        lessonNumber = parseInt(lessonNumber, 10); 
        
                        let response;
                        if (request.originalUrl.includes('course')) {
                            response = await new Promise((resolve, reject) => {
                                const query = "UPDATE contents SET number = ? WHERE number = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND levelNumber = ? AND lessonNumber = ? AND category = 'course'";
                    
                                connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber, unitNumber, levelNumber, lessonNumber] , (err, result) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(result.affectedRows);
                                })
                            });
                        } else {
                            response = await new Promise((resolve, reject) => {
                                const query = "UPDATE contents SET number = ? WHERE number = ? AND curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND category = 'test'";
                    
                                connection.query(query, [newNumbers[i], currentNumbers[i], curriculumVersion, sectionNumber, unitNumber] , (err, result) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(result.affectedRows);
                                })
                            });
                        }
                
                        return response === 1 ? { success: true } : { error: "خطأ فى تحديث قاعدة البيانات." };
                    }
                } catch (error) {
                    console.log(error);
                    return { error: "خطأ فى إنشاء اتصال بقاعدة البيانات." }
                }
            }
            
            for (let i = 0; i < currentNumbers.length; i++) {
                if (i === currentNumbers.length - 1) {
                    updateData(i)
                    .then(data => response.json(data))
                    .catch(err => console.log(err));
                } else {
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

// Getting Test Content Function
const getTestContent = (request, response) => {
    let { curriculumVersion, sectionNumber, unitNumber } = request.params;
    async function getData(){
        try {
            curriculumVersion = parseInt(curriculumVersion, 10);
            sectionNumber = parseInt(sectionNumber, 10);
            unitNumber = parseInt(unitNumber, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM contents WHERE curriculumVersion = ? AND sectionNumber = ? AND unitNumber = ? AND category = 'test' ORDER BY number ASC;";
    
                connection.query(query, [curriculumVersion, sectionNumber, unitNumber], (err, results) => {
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

// Inserting Test Content Function
const insertTestContent = (request, response) => {
    if (request.user && request.content) {
        if (request.released === 'false') {
            let { curriculumVersion, sectionNumber, unitNumber } = request.params;
            const { number, type, category, content } = request.body;
        
            async function insertData(){
                try {
                    if (!curriculumVersion || !sectionNumber || !unitNumber || !number || !type || !category || !content) {
                        return { error: "يرجى إدخال جميع المعلومات." };
                    } else {
                        // Declaring Content Available
                        let contentAvailable = true;

                        // If Multiple Content
                        if (content.includes('&')) {
                            // Assgning Separated Content
                            const separatedContent = content.split('&');

                            // For Every Separated Content
                            for (let index = 0; index < separatedContent.length; index++) {
                                // Declaring Content Constant
                                const eachSeparatedContent = separatedContent[index];

                                // If Letter
                                if (eachSeparatedContent.length === 1) {
                                    // Selecting Letter
                                    const response = await new Promise((resolve, reject) => {
                                        const query = "SELECT * FROM letters WHERE letter = ?";
                            
                                        connection.query(query, [eachSeparatedContent], (err, results) => {
                                            if (err) {
                                                reject(new Error(err.message));
                                            } else {
                                                resolve(results);
                                            }
                                        })
                                    });

                                    // If Letter Not Available
                                    if (!response[0]) {
                                        contentAvailable = false;
                                    }

                                // If Word
                                } else {
                                    // Selecting Word
                                    const response = await new Promise((resolve, reject) => {
                                        const query = "SELECT * FROM dictionary WHERE word = ?";
                            
                                        connection.query(query, [eachSeparatedContent], (err, results) => {
                                            if (err) {
                                                reject(new Error(err.message));
                                            } else {
                                                resolve(results);
                                            }
                                        })
                                    });

                                    // If Word Not Available
                                    if (!response[0]) {
                                        contentAvailable = false;
                                    }
                                }
                            }

                        // If Single Content
                        } else {
                            // If Letter
                            if (content.length === 1) {
                                // Selecting Letter
                                const response = await new Promise((resolve, reject) => {
                                    const query = "SELECT * FROM letters WHERE letter = ?";
                        
                                    connection.query(query, [content], (err, results) => {
                                        if (err) {
                                            reject(new Error(err.message));
                                        } else {
                                            resolve(results);
                                        }
                                    })
                                });

                                // If Letter Not Available
                                if (!response[0]) {
                                    contentAvailable = false;
                                }

                            // If Word
                            } else {
                                // Selecting Word
                                const response = await new Promise((resolve, reject) => {
                                    const query = "SELECT * FROM dictionary WHERE word = ?";
                        
                                    connection.query(query, [content], (err, results) => {
                                        if (err) {
                                            reject(new Error(err.message));
                                        } else {
                                            resolve(results);
                                        }
                                    })
                                });

                                // If Word Not Available
                                if (!response[0]) {
                                    contentAvailable = false;
                                }
                            }
                        }

                        if (contentAvailable) {
                            curriculumVersion = parseInt(curriculumVersion, 10);
                            sectionNumber = parseInt(sectionNumber, 10);
                            unitNumber = parseInt(unitNumber, 10);
            
                            const response = await new Promise((resolve, reject) => {
                                const query = "INSERT INTO contents (curriculumVersion, sectionNumber, unitNumber, number, type, category, content) VALUES (?,?,?,?,?,?,?)";
            
                                connection.query(query, [curriculumVersion, sectionNumber, unitNumber, number, type, category, content] , (err, result) => {
                                    if (err) {
                                        reject(new Error(err.message));
                                    } else {
                                        resolve({ success: true });
                                    }
                                })
                            });
                            
                            return response;
                        }
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

// Exporting Functions
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