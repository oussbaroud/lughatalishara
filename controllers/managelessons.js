const connection = require('../dbService').connection;

const getAllSections = (request, response) => {
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM sections ORDER BY number ASC;";
    
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const insertSection = (request, response) => {
    const { number, title } = request.body;

    async function insertData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO sections (number, title) VALUES (?,?);";

                connection.query(query, [number, title] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }
    
    insertData()
    .then(data => response.json({data : data}))
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
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    updateData()
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
}

const updateSectionsOrder = (request, response) => {
    const { ids, newNumbers } = request.body;
    console.log(ids, newNumbers);

    async function updateData(i){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE sections SET number = ? WHERE id = ?";
    
                connection.query(query, [newNumbers[i], ids[i]] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    for(let i = 0; i < ids.length; i++){
        if(i === ids.length - 1){
            updateData(i)
            .then(data => response.json({success : data}))
            .catch(err => console.log(err));
        }else{
            updateData(i);
        }
    }
}

const deleteSection = (request, response) => {
    let { sectionId, deleteThis } = request.params;
    async function deleteData(){
        try {
            sectionId = parseInt(sectionId, 10); 
            const response = await new Promise((resolve, reject) => {
                let query;
                if(deleteThis === "Section"){
                    console.log(deleteThis);
                    query = "DELETE FROM sections WHERE number = ?";
                }else if(deleteThis === "Section And Units"){
                    query = "DELETE sections, units FROM sections INNER JOIN units ON units.sectionId = sections.number WHERE sections.number = ?";
                }else if(deleteThis === "Section, Units And Levels"){
                    query = "DELETE sections, units, levels FROM sections INNER JOIN units ON units.sectionId = sections.number INNER JOIN levels ON levels.sectionId = sections.number WHERE sections.number = ?";
                }else if(deleteThis === "Section, Units, Levels And Lessons"){
                    query = "DELETE sections, units, levels, lessons FROM sections INNER JOIN units ON units.sectionId = sections.number INNER JOIN levels ON levels.sectionId = sections.number INNER JOIN lessons ON lessons.sectionId = sections.number WHERE sections.number = ?";
                }else if(deleteThis === "Section, Units, Levels, Lessons And Contents"){
                    query = "DELETE sections, units, levels, lessons, contents FROM sections INNER JOIN units ON units.sectionId = sections.number INNER JOIN levels ON levels.sectionId = sections.number INNER JOIN lessons ON lessons.sectionId = sections.number INNER JOIN contents ON contents.sectionId = sections.number WHERE sections.number = ?";
                }
    
                connection.query(query, [sectionId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response >= 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    deleteData()
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
}

const fillSectionsGap = (request, response) => {
    const { updateThis, currentNumbers, newNumbers } = request.body;

    async function updateData(i){
        try {
            let sectionsResponse = 0;
            async function updateSections(){
                console.log(currentNumbers, newNumbers);
                sectionsResponse = await new Promise((resolve, reject) => {
                    const query = "UPDATE sections SET number = ? WHERE number = ?";
        
                    connection.query(query, [newNumbers[i], currentNumbers[i]] , (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    })
                });
            }
            let unitsResponse = 0;
            async function updateUnits(){
                unitsResponse = await new Promise((resolve, reject) => {
                    const query = "UPDATE units SET sectionId = ? WHERE sectionId = ?";
        
                    connection.query(query, [newNumbers[i], currentNumbers[i]] , (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    })
                });
            }
            let levelsResponse = 0;
            async function updateLevels(){
                levelsResponse = await new Promise((resolve, reject) => {
                    const query = "UPDATE levels SET sectionId = ? WHERE sectionId = ?";
        
                    connection.query(query, [newNumbers[i], currentNumbers[i]] , (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    })
                });
            }
            let lessonsResponse = 0;
            async function updateLessons(){
                lessonsResponse = await new Promise((resolve, reject) => {
                    const query = "UPDATE lessons SET sectionId = ? WHERE sectionId = ?";
        
                    connection.query(query, [newNumbers[i], currentNumbers[i]] , (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    })
                });
            }
            let contentsResponse = 0;
            async function updateContents(){
                contentsResponse = await new Promise((resolve, reject) => {
                    const query = "UPDATE contents SET sectionId = ? WHERE sectionId = ?";
        
                    connection.query(query, [newNumbers[i], currentNumbers[i]] , (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    })
                });
            }
            
            if(updateThis[i] === "Section"){
                await updateSections();
            }else if(updateThis[i] === "Section And Units"){
                await updateSections();
                await updateUnits();
            }else if(updateThis[i] === "Section, Units And Levels"){
                await updateSections();
                await updateUnits();
                await updateLevels();
            }else if(updateThis[i] === "Section, Units, Levels And Lessons"){
                await updateSections();
                await updateUnits();
                await updateLevels();
                await updateLessons();
            }else if(updateThis[i] === "Section, Units, Levels, Lessons And Contents"){
                await updateSections();
                await updateUnits();
                await updateLevels();
                await updateLessons();
                await updateContents();
            }
            
            const response = sectionsResponse + unitsResponse + levelsResponse + lessonsResponse + contentsResponse;
            return response >= 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    for(let i = 0; i < currentNumbers.length; i++){
        if(i === currentNumbers.length - 1){
            updateData(i)
            .then(data => response.json({success : data}))
            .catch(err => console.log(err));
        }else{
            updateData(i);
        }
    }
}

const getAllUnits = (request, response) => {
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM units ORDER BY number ASC;";
    
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}
const getUnits = (request, response) => {
    let { sectionId } = request.params;
    async function getData(){
        try {
            sectionId = parseInt(sectionId, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM units WHERE sectionId = ? ORDER BY number ASC;";
    
                connection.query(query, [sectionId], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const insertUnit = (request, response) => {
    let { sectionId } = request.params;
    const { number, title } = request.body;

    async function insertData(){
        try {
            sectionId = parseInt(sectionId, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO units (sectionId, number, title) VALUES (?,?,?);";

                connection.query(query, [sectionId, number, title] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }
    
    insertData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const updateUnitTitle = (request, response) => {
    let { sectionId, unitId } = request.params;
    const { newTitle } = request.body;

    async function updateData(){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE units SET title = ? WHERE id = ? AND sectionId = ?";
    
                connection.query(query, [newTitle, unitId, sectionId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    updateData()
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
}

const updateUnitsOrder = (request, response) => {
    let { sectionId } = request.params;
    const { ids, newNumbers } = request.body;
    console.log(ids, newNumbers);

    async function updateData(i){
        try {
            sectionId = parseInt(sectionId, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE units SET number = ? WHERE id = ? AND sectionId = ?";
    
                connection.query(query, [newNumbers[i], ids[i], sectionId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    for(let i = 0; i < ids.length; i++){
        if(i === ids.length - 1){
            updateData(i)
            .then(data => response.json({success : data}))
            .catch(err => console.log(err));
        }else{
            updateData(i);
        }
    }
}

const deleteUnit = (request, response) => {
    let { sectionId, unitId, deleteThis } = request.params;
    async function deleteData(){
        try {
            sectionId = parseInt(sectionId, 10); 
            unitId = parseInt(unitId, 10); 
            const response = await new Promise((resolve, reject) => {
                let query;
                console.log(deleteThis);

                if(deleteThis === "Unit"){
                    query = "DELETE FROM units WHERE id = ?";
                }else if(deleteThis === "Unit And Levels"){
                    query = "DELETE units, levels FROM units INNER JOIN levels ON levels.unitId = units.id WHERE units.id = ?";
                }else if(deleteThis === "Unit, Levels And Lessons"){
                    query = "DELETE units, levels, lessons FROM units INNER JOIN levels ON levels.unitId = units.id INNER JOIN lessons ON lessons.unitId = units.id WHERE units.id = ?";
                }else if(deleteThis === "Unit, Levels, Lessons And Contents"){
                    query = "DELETE units, levels, lessons, contents FROM units INNER JOIN levels ON levels.unitId = units.id INNER JOIN lessons ON lessons.unitId = units.id INNER JOIN contents ON contents.unitId = units.id WHERE units.id = ?";
                }

                connection.query(query, [unitId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    deleteData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const fillUnitsGap = (request, response) => {
    let { sectionId } = request.params;
    const { currentNumbers, newNumbers } = request.body;
    console.log(currentNumbers, newNumbers);

    async function updateData(i){
        try {
            sectionId = parseInt(sectionId, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE units SET number = ? WHERE number = ? AND sectionId = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    for(let i = 0; i < currentNumbers.length; i++){
        if(i === currentNumbers.length - 1){
            updateData(i)
            .then(data => response.json({success : data}))
            .catch(err => console.log(err));
        }else{
            updateData(i);
        }
    }
}

const getAllLevels = (request, response) => {
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM levels ORDER BY number ASC;";
    
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}
const getLevels = (request, response) => {
    let { sectionId, unitId } = request.params;
    async function getData(){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM levels WHERE sectionId = ? AND unitId = ? ORDER BY number ASC;";
    
                connection.query(query, [sectionId, unitId], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const insertLevel = (request, response) => {
    let { sectionId, unitId } = request.params;
    const { number, title } = request.body;

    async function insertData(){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO levels (sectionId, unitId, number, title) VALUES (?,?,?,?);";

                connection.query(query, [sectionId, unitId, number, title] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }
    
    insertData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const updateLevelTitle = (request, response) => {
    let { sectionId, unitId, levelId } = request.params;
    const { newTitle } = request.body;

    async function updateData(){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10);
            levelId = parseInt(levelId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE levels SET title = ? WHERE id = ? AND sectionId = ? AND unitId = ?";
    
                connection.query(query, [newTitle, levelId, sectionId, unitId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    updateData()
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
}

const updateLevelsOrder = (request, response) => {
    let { sectionId, unitId } = request.params;
    const { ids, newNumbers } = request.body;
    console.log(ids, newNumbers);

    async function updateData(i){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE levels SET number = ? WHERE id = ? AND sectionId = ? AND unitId = ?";
    
                connection.query(query, [newNumbers[i], ids[i], sectionId, unitId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    for(let i = 0; i < ids.length; i++){
        if(i === ids.length - 1){
            updateData(i)
            .then(data => response.json({success : data}))
            .catch(err => console.log(err));
        }else{
            updateData(i);
        }
    }
}

const deleteLevel = (request, response) => {
    let { levelId, deleteThis } = request.params;
    async function deleteData(){
        try {
            levelId = parseInt(levelId, 10); 

            const response = await new Promise((resolve, reject) => {
                let query;
                console.log(deleteThis);

                if(deleteThis === "Level"){
                    query = "DELETE FROM levels WHERE id = ?";
                }else if(deleteThis === "Level And Lessons"){
                    query = "DELETE levels, lessons FROM levels INNER JOIN lessons ON lessons.levelId = levels.id WHERE levels.id = ?";
                }else if(deleteThis === "Level, Lessons And Contents"){
                    query = "DELETE levels, lessons, contents FROM levels INNER JOIN lessons ON lessons.levelId = levels.id INNER JOIN contents ON contents.levelId = levels.id WHERE levels.id = ?";
                }

                connection.query(query, [levelId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    deleteData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const fillLevelsGap = (request, response) => {
    let { sectionId, unitId } = request.params;
    const { currentNumbers, newNumbers } = request.body;
    console.log(currentNumbers, newNumbers);

    async function updateData(i){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10); 

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE levels SET number = ? WHERE number = ? AND sectionId = ? AND unitId = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionId, unitId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    for(let i = 0; i < currentNumbers.length; i++){
        if(i === currentNumbers.length - 1){
            updateData(i)
            .then(data => response.json({success : data}))
            .catch(err => console.log(err));
        }else{
            updateData(i);
        }
    }
}

const getAllLessons = (request, response) => {
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM lessons ORDER BY number ASC;";
    
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}
const getLessons = (request, response) => {
    let { sectionId, unitId, levelId } = request.params;
    async function getData(){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10);
            levelId = parseInt(levelId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, number, title FROM lessons WHERE sectionId = ? AND unitId = ? AND levelId =? ORDER BY number ASC;";
    
                connection.query(query, [sectionId, unitId, levelId], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const insertLesson = (request, response) => {
    let { sectionId, unitId, levelId } = request.params;
    const { number, title } = request.body;

    async function insertData(){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10);
            levelId = parseInt(levelId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO lessons (sectionId, unitId, levelId, number, title) VALUES (?,?,?,?,?);";

                connection.query(query, [sectionId, unitId, levelId, number, title] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }
    
    insertData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const updateLessonTitle = (request, response) => {
    let { sectionId, unitId, lessonId } = request.params;
    const { newTitle } = request.body;

    async function updateData(){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10);
            lessonId = parseInt(lessonId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE lessons SET title = ? WHERE id = ?";
    
                connection.query(query, [newTitle, lessonId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    updateData()
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
}

const updateLessonsOrder = (request, response) => {
    let { sectionId, unitId } = request.params;
    const { ids, newNumbers } = request.body;
    console.log(ids, newNumbers);

    async function updateData(i){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE lessons SET number = ? WHERE id = ?";
    
                connection.query(query, [newNumbers[i], ids[i]] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    for(let i = 0; i < ids.length; i++){
        if(i === ids.length - 1){
            updateData(i)
            .then(data => response.json({success : data}))
            .catch(err => console.log(err));
        }else{
            updateData(i);
        }
    }
}

const deleteLesson = (request, response) => {
    let { lessonId, deleteThis } = request.params;
    async function deleteData(){
        try {
            lessonId = parseInt(lessonId, 10); 

            const response = await new Promise((resolve, reject) => {
                let query;
                console.log(deleteThis);

                if(deleteThis === "Lesson"){
                    query = "DELETE FROM lessons WHERE id = ?";
                }else if(deleteThis === "Lesson And Contents"){
                    query = "DELETE lessons, contents FROM lessons INNER JOIN contents ON contents.lessonId = lessons.id WHERE lessons.id = ?";
                }

                connection.query(query, [lessonId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    deleteData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const fillLessonsGap = (request, response) => {
    let { sectionId, unitId, levelId } = request.params;
    const { currentNumbers, newNumbers } = request.body;
    console.log(currentNumbers, newNumbers);

    async function updateData(i){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10); 
            levelId = parseInt(levelId, 10); 

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE lessons SET number = ? WHERE number = ? AND sectionId = ? AND unitId = ? AND levelId = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionId, unitId, levelId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    for(let i = 0; i < currentNumbers.length; i++){
        if(i === currentNumbers.length - 1){
            updateData(i)
            .then(data => response.json({success : data}))
            .catch(err => console.log(err));
        }else{
            updateData(i);
        }
    }
}

const getAllContents = (request, response) => {
    let { content, position } = request.params;
    async function getData(){
        try {
            position = parseInt(position, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM contents WHERE content = ? AND position < ?;";
    
                connection.query(query, [content, position], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}
const getContents = (request, response) => {
    let { sectionId, unitId, levelId, lessonId } = request.params;
    async function getData(){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10);
            levelId = parseInt(levelId, 10);
            lessonId = parseInt(lessonId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM contents WHERE sectionId = ? AND unitId = ? AND levelId =? AND lessonId = ? ORDER BY number ASC;";
    
                connection.query(query, [sectionId, unitId, levelId, lessonId], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const insertContent = (request, response) => {
    let { sectionId, unitId, levelId, lessonId } = request.params;
    const { number, type, category, title } = request.body;

    async function insertData(){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10);
            levelId = parseInt(levelId, 10);
            lessonId = parseInt(lessonId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO contents (sectionId, unitId, levelId, lessonId, number, type, category, content) VALUES (?,?,?,?,?,?,?,?);";

                connection.query(query, [sectionId, unitId, levelId, lessonId, number, type, category, title] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }
    
    insertData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const updateContent = (request, response) => {
    let { sectionId, unitId, contentId } = request.params;
    const { newTitle } = request.body;

    async function updateData(){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10);
            contentId = parseInt(contentId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE contents SET content = ? WHERE id = ?";
    
                connection.query(query, [newTitle, contentId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    updateData()
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
}

const updateContentsOrder = (request, response) => {
    let { sectionId, unitId } = request.params;
    const { ids, newNumbers } = request.body;
    console.log(ids, newNumbers);

    async function updateData(i){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE contents SET number = ? WHERE id = ?";
    
                connection.query(query, [newNumbers[i], ids[i]] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    for(let i = 0; i < ids.length; i++){
        if(i === ids.length - 1){
            updateData(i)
            .then(data => response.json({success : data}))
            .catch(err => console.log(err));
        }else{
            updateData(i);
        }
    }
}

const deleteContent = (request, response) => {
    let { contentId } = request.params;
    async function deleteData(){
        try {
            contentId = parseInt(contentId, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM contents WHERE number = ?";
    
                connection.query(query, [contentId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    deleteData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const fillContentsGap = (request, response) => {
    let { sectionId, unitId, levelId, lessonId } = request.params;
    const { currentNumbers, newNumbers } = request.body;
    console.log(currentNumbers, newNumbers);

    async function updateData(i){
        try {
            sectionId = parseInt(sectionId, 10);
            unitId = parseInt(unitId, 10); 
            levelId = parseInt(levelId, 10);
            lessonId = parseInt(lessonId, 10); 

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE contents SET number = ? WHERE number = ? AND sectionId = ? AND unitId = ? AND levelId = ? AND lessonId = ?";
    
                connection.query(query, [newNumbers[i], currentNumbers[i], sectionId, unitId, levelId, lessonId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    for(let i = 0; i < currentNumbers.length; i++){
        if(i === currentNumbers.length - 1){
            updateData(i)
            .then(data => response.json({success : data}))
            .catch(err => console.log(err));
        }else{
            updateData(i);
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
    getAllUnits,
    getUnits,
    insertUnit,
    updateUnitTitle,
    updateUnitsOrder,
    deleteUnit,
    fillUnitsGap,
    getAllLevels,
    getLevels,
    insertLevel,
    updateLevelTitle,
    updateLevelsOrder,
    deleteLevel,
    fillLevelsGap,
    getAllLessons,
    getLessons,
    insertLesson,
    updateLessonTitle,
    updateLessonsOrder,
    deleteLesson,
    fillLessonsGap,
    getAllContents,
    getContents,
    insertContent,
    updateContent,
    updateContentsOrder,
    deleteContent,
    fillContentsGap
};